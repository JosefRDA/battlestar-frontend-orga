"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const API_BASE = "http://localhost:4000/incidents"

interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

function useApi() {
  const [loading, setLoading] = useState<string | null>(null)
  const [response, setResponse] = useState<ApiResponse<unknown> | null>(null)

  const call = async (label: string, fn: () => Promise<Response>) => {
    setLoading(label)
    setResponse(null)
    try {
      const res = await fn()
      const text = await res.text()
      let data: unknown
      try {
        data = text ? JSON.parse(text) : null
      } catch {
        data = text
      }
      setResponse({ data, message: `${res.status} ${res.statusText}` })
    } catch (err) {
      setResponse({ error: err instanceof Error ? err.message : String(err) })
    } finally {
      setLoading(null)
    }
  }

  return { loading, response, call }
}

function JsonDisplay({ data }: { data: unknown }) {
  return (
    <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-md text-xs overflow-auto max-h-64 whitespace-pre-wrap break-words">
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}

function TestCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  )
}

function ListIncidents() {
  const { loading, response, call } = useApi()
  return (
    <TestCard
      title="GET /incidents"
      description="List all incidents"
    >
      <Button onClick={() => call("GET /incidents", () => fetch(API_BASE))} disabled={!!loading}>
        {loading === "GET /incidents" ? "Loading..." : "Fetch All"}
      </Button>
      {response && (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500">{response.message || (response.error ? "Error" : "Success")}</p>
          {response.error ? (
            <p className="text-red-500 text-sm">{response.error}</p>
          ) : response.data ? (
            <JsonDisplay data={response.data} />
          ) : null}
        </div>
      )}
    </TestCard>
  )
}

function GetIncident() {
  const { loading, response, call } = useApi()
  const [id, setId] = useState("")
  return (
    <TestCard
      title="GET /incidents/:id"
      description="Get one incident by ID"
    >
      <div className="space-y-2">
        <Input
          placeholder="Incident ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="max-w-xs"
        />
        <Button
          onClick={() => id && call(`GET /incidents/${id}`, () => fetch(`${API_BASE}/${id}`))}
          disabled={!!loading || !id}
        >
          {loading === `GET /incidents/${id}` ? "Loading..." : "Fetch One"}
        </Button>
      </div>
      {response && (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500">{response.message || (response.error ? "Error" : "Success")}</p>
          {response.error ? (
            <p className="text-red-500 text-sm">{response.error}</p>
          ) : response.data ? (
            <JsonDisplay data={response.data} />
          ) : null}
        </div>
      )}
    </TestCard>
  )
}

function CreateIncident() {
  const { loading, response, call } = useApi()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [picture, setPicture] = useState("")
  const [partsNeededToFixIds, setPartsNeededToFixIds] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body: Record<string, unknown> = { name }
    if (description) body.description = description
    if (picture) body.picture = picture
    if (partsNeededToFixIds) {
      body.partsNeededToFixIds = partsNeededToFixIds.split(",").map((s) => s.trim()).filter(Boolean)
    }
    call("POST /incidents", () =>
      fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    )
  }

  return (
    <TestCard
      title="POST /incidents"
      description="Create incident (name required, description/picture/partsNeededToFixIds optional)"
    >
      <form onSubmit={handleSubmit} className="space-y-2 max-w-md">
        <div>
          <label className="text-xs text-zinc-500">Name *</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Incident name"
            required
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Picture URL</label>
          <Input
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
            placeholder="Optional picture URL"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Parts Needed To Fix IDs (comma-separated)</label>
          <Input
            value={partsNeededToFixIds}
            onChange={(e) => setPartsNeededToFixIds(e.target.value)}
            placeholder="id1,id2,id3"
          />
        </div>
        <Button type="submit" disabled={!!loading || !name}>
          {loading === "POST /incidents" ? "Creating..." : "Create"}
        </Button>
      </form>
      {response && (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500">{response.message || (response.error ? "Error" : "Success")}</p>
          {response.error ? (
            <p className="text-red-500 text-sm">{response.error}</p>
          ) : response.data ? (
            <JsonDisplay data={response.data} />
          ) : null}
        </div>
      )}
    </TestCard>
  )
}

function PatchIncident() {
  const { loading, response, call } = useApi()
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [picture, setPicture] = useState("")
  const [partsNeededToFixIds, setPartsNeededToFixIds] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    const body: Record<string, unknown> = {}
    if (name) body.name = name
    if (description) body.description = description
    if (picture) body.picture = picture
    if (partsNeededToFixIds) {
      body.partsNeededToFixIds = partsNeededToFixIds.split(",").map((s) => s.trim()).filter(Boolean)
    }
    call(`PATCH /incidents/${id}`, () =>
      fetch(`${API_BASE}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    )
  }

  return (
    <TestCard
      title="PATCH /incidents/:id"
      description="Partial update - send only fields to change"
    >
      <form onSubmit={handleSubmit} className="space-y-2 max-w-md">
        <div>
          <label className="text-xs text-zinc-500">Incident ID *</label>
          <Input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Incident ID"
            required
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Picture URL</label>
          <Input
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Parts Needed To Fix IDs (comma-separated)</label>
          <Input
            value={partsNeededToFixIds}
            onChange={(e) => setPartsNeededToFixIds(e.target.value)}
            placeholder="id1,id2,id3"
          />
        </div>
        <Button type="submit" disabled={!!loading || !id}>
          {loading?.startsWith("PATCH") ? "Updating..." : "Patch"}
        </Button>
      </form>
      {response && (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500">{response.message || (response.error ? "Error" : "Success")}</p>
          {response.error ? (
            <p className="text-red-500 text-sm">{response.error}</p>
          ) : response.data ? (
            <JsonDisplay data={response.data} />
          ) : null}
        </div>
      )}
    </TestCard>
  )
}

function PutIncident() {
  const { loading, response, call } = useApi()
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [picture, setPicture] = useState("")
  const [partsNeededToFixIds, setPartsNeededToFixIds] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !name) return
    const body: Record<string, unknown> = { name }
    body.description = description || ""
    body.picture = picture || ""
    body.partsNeededToFixIds = partsNeededToFixIds
      ? partsNeededToFixIds.split(",").map((s) => s.trim()).filter(Boolean)
      : []
    call(`PUT /incidents/${id}`, () =>
      fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    )
  }

  return (
    <TestCard
      title="PUT /incidents/:id"
      description="Full update - all fields required (name mandatory, others empty string if omitted)"
    >
      <form onSubmit={handleSubmit} className="space-y-2 max-w-md">
        <div>
          <label className="text-xs text-zinc-500">Incident ID *</label>
          <Input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Incident ID"
            required
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Name *</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Incident name"
            required
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional (empty string if omitted)"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Picture URL</label>
          <Input
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
            placeholder="Optional (empty string if omitted)"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Parts Needed To Fix IDs (comma-separated)</label>
          <Input
            value={partsNeededToFixIds}
            onChange={(e) => setPartsNeededToFixIds(e.target.value)}
            placeholder="id1,id2,id3 (empty array if omitted)"
          />
        </div>
        <Button type="submit" disabled={!!loading || !id || !name}>
          {loading?.startsWith("PUT") ? "Updating..." : "Put"}
        </Button>
      </form>
      {response && (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500">{response.message || (response.error ? "Error" : "Success")}</p>
          {response.error ? (
            <p className="text-red-500 text-sm">{response.error}</p>
          ) : response.data ? (
            <JsonDisplay data={response.data} />
          ) : null}
        </div>
      )}
    </TestCard>
  )
}

function DeleteIncident() {
  const { loading, response, call } = useApi()
  const [id, setId] = useState("")

  return (
    <TestCard
      title="DELETE /incidents/:id"
      description="Delete an incident by ID"
    >
      <div className="space-y-2">
        <Input
          placeholder="Incident ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="destructive"
          onClick={() => id && call(`DELETE /incidents/${id}`, () => fetch(`${API_BASE}/${id}`, { method: "DELETE" }))}
          disabled={!!loading || !id}
        >
          {loading === `DELETE /incidents/${id}` ? "Deleting..." : "Delete"}
        </Button>
      </div>
      {response && (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500">{response.message || (response.error ? "Error" : "Success")}</p>
          {response.error ? (
            <p className="text-red-500 text-sm">{response.error}</p>
          ) : (
            <p className="text-green-500 text-sm">Deleted successfully (204 No Content)</p>
          )}
        </div>
      )}
    </TestCard>
  )
}

export default function IncidentsTestPanel() {
  return (
    <div className="space-y-6 p-4">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
          Incidents API Test Panel
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Backend: http://localhost:4000/incidents
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ListIncidents />
        <GetIncident />
        <CreateIncident />
        <PatchIncident />
        <PutIncident />
        <DeleteIncident />
      </div>
    </div>
  )
}