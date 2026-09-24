export type ProposalStatus = 'new' | 'reviewing' | 'considered' | 'implemented' | 'archived'

export type YouthProposal = {
  id: string
  created_at: string
  age_range: string | null
  location: string | null
  category: string
  proposal: string
  importance: string | null
  implementation_idea: string | null
  wants_to_participate: string | null
  contact_requested: boolean
  name: string | null
  email: string | null
  phone: string | null
  status: ProposalStatus
  admin_notes: string | null
  is_archived: boolean
  source: string
}

export type YouthProposalInsert = Omit<YouthProposal, 'id' | 'created_at' | 'status' | 'admin_notes' | 'is_archived' | 'source'>

export type Resource = {
  id: string
  title: string
  slug: string
  category: string
  summary: string
  content: string
  icon: string | null
  published: boolean
  display_order: number
  created_at?: string
  updated_at?: string
}

export type Tip = {
  id: string
  text: string
  published: boolean
  display_order: number
}

export type FaqItem = {
  id: string
  question: string
  answer: string
  published: boolean
  display_order: number
}

export type SiteSetting = {
  key: string
  label: string
  value: string
  is_public: boolean
}
