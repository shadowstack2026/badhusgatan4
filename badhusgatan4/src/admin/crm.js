import { supabase } from '../lib/supabase'
import { sendLeadMail } from '../lib/mail'

export const LEAD_STATUS = {
  ny: 'Ny',
  kontaktad: 'Kontaktad',
  ko: 'I kö',
  godkand: 'Godkänd',
  avbojd: 'Avslagen',
}

export const KIND = { intresse: 'Intresse för plats', 'prova-dag': 'Prova en dag', besok: 'Boka besök' }

export const sv = (d) => (d ? new Date(d).toLocaleDateString('sv-SE') : '–')

export const activeMembers = (members, spaceId) =>
  members.filter((m) => m.space_type === spaceId && !m.ended_at)

// Köade för en platstyp, äldsta först (först till kvarn).
export const queueOf = (leads, spaceId) =>
  leads.filter((l) => l.space_type === spaceId && l.status === 'ko').sort((a, b) => a.created_at.localeCompare(b.created_at))

export const log = (text) => supabase.from('activity_log').insert({ text })

const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
export function downloadCsv(filename, head, rows) {
  const csv = '﻿' + [head, ...rows].map((row) => row.map(csvCell).join(';')).join('\r\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

// Ger en person en plats: skapar medlem, markerar intresseanmälan som godkänd och
// mejlar vid behov. Returnerar { error } eller { ok, mailError }.
export async function placeLead({ lead, space, members, mail }) {
  if (activeMembers(members, space.id).length >= space.capacity) {
    return { error: `${space.title} är fullt. Öka antalet platser eller avsluta någon först.` }
  }
  const { error } = await supabase.from('members').insert({
    lead_id: lead.id,
    space_type: space.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
  })
  if (error) return { error: error.message }
  await supabase.from('leads').update({ status: 'godkand', approved_at: new Date().toISOString() }).eq('id', lead.id)
  await log(`${lead.name} fick plats: ${space.title}`)
  let mailError = null
  if (mail) {
    try {
      await sendLeadMail({ lead, spaceTitle: space.title, fromQueue: lead.status === 'ko' })
    } catch (err) {
      mailError = err.message || err.text || 'okänt fel'
    }
  }
  return { ok: true, mailError }
}

export async function endMember(member, space) {
  const { error } = await supabase
    .from('members')
    .update({ ended_at: new Date().toISOString().slice(0, 10) })
    .eq('id', member.id)
  if (!error) await log(`${member.name} lämnade ${space?.title ?? 'sin plats'}`)
  return { error: error?.message }
}
