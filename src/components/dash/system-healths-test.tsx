"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const API_BASE = "http://localhost:4000/system-healths"

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

function ListSystemHealths() {
  const { loading, response, call } = useApi()
  return (
    <TestCard
      title="GET /system-healths"
      description="List all system health records"
    >
      <Button onClick={() => call("GET /system-healths", () => fetch(API_BASE))} disabled={!!loading}>
        {loading === "GET /system-healths" ? "Loading..." : "Fetch All"}
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

function GetSystemHealth() {
  const { loading, response, call } = useApi()
  const [id, setId] = useState("")
  return (
    <TestCard
      title="GET /system-healths/:id"
      description="Get one system health record by ID"
    >
      <div className="space-y-2">
        <Input
          placeholder="System Health ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="max-w-xs"
        />
        <Button
          onClick={() => id && call(`GET /system-healths/${id}`, () => fetch(`${API_BASE}/${id}`))}
          disabled={!!loading || !id}
        >
          {loading === `GET /system-healths/${id}` ? "Loading..." : "Fetch One"}
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

function CreateSystemHealth() {
  const { loading, response, call } = useApi()
  const [health, setHealth] = useState("")
  const [systemId, setSystemId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body: Record<string, unknown> = {
      heath: parseInt(health, 10),
      systemId,
    }
    call("POST /system-healths", () =>
      fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    )
  }

  return (
    <TestCard
      title="POST /system-healths"
      description="Create system health record (heath and systemId required, maintenance defaults to false)"
    >
      <form onSubmit={handleSubmit} className="space-y-2 max-w-md">
        <div>
          <label className="text-xs text-zinc-500">Health (0-100) *</label>
          <Input
            type="number"
            min="0"
            max="100"
            value={health}
            onChange={(e) => setHealth(e.target.value)}
            placeholder="e.g., 85"
            required
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">System ID *</label>
          <Input
            value={systemId}
            onChange={(e) => setSystemId(e.target.value)}
            placeholder="System ID"
            required
          />
        </div>
        <Button type="submit" disabled={!!loading || !health || !systemId}>
          {loading === "POST /system-healths" ? "Creating..." : "Create"}
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

function PatchSystemHealth() {
  const { loading, response, call } = useApi()
  const [id, setId] = useState("")
  const [health, setHealth] = useState("")
  const [systemId, setSystemId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    const body: Record<string, unknown> = {}
    if (health) body.heath = parseInt(health, 10)
    if (systemId) body.systemId = systemId
    call(`PATCH /system-healths/${id}`, () =>
      fetch(`${API_BASE}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    )
  }

  return (
    <TestCard
      title="PATCH /system-healths/:id"
      description="Partial update - send only fields to change"
    >
      <form onSubmit={handleSubmit} className="space-y-2 max-w-md">
        <div>
          <label className="text-xs text-zinc-500">System Health ID *</label>
          <Input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="System Health ID"
            required
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Health (0-100)</label>
          <Input
            type="number"
            min="0"
            max="100"
            value={health}
            onChange={(e) => setHealth(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">System ID</label>
          <Input
            value={systemId}
            onChange={(e) => setSystemId(e.target.value)}
            placeholder="Optional"
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

function PutSystemHealth() {
  const { loading, response, call } = useApi()
  const [id, setId] = useState("")
  const [health, setHealth] = useState("")
  const [systemId, setSystemId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !health || !systemId) return
    const body: Record<string, unknown> = {
      heath: parseInt(health, 10),
      systemId,
    }
    call(`PUT /system-healths/${id}`, () =>
      fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    )
  }

  return (
    <TestCard
      title="PUT /system-healths/:id"
      description="Full update - all fields required (heath and systemId mandatory)"
    >
      <form onSubmit={handleSubmit} className="space-y-2 max-w-md">
        <div>
          <label className="text-xs text-zinc-500">System Health ID *</label>
          <Input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="System Health ID"
            required
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Health (0-100) *</label>
          <Input
            type="number"
            min="0"
            max="100"
            value={health}
            onChange={(e) => setHealth(e.target.value)}
            placeholder="Health value"
            required
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">System ID *</label>
          <Input
            value={systemId}
            onChange={(e) => setSystemId(e.target.value)}
            placeholder="System ID"
            required
          />
        </div>
        <Button type="submit" disabled={!!loading || !id || !health || !systemId}>
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

function DeleteSystemHealth() {
  const { loading, response, call } = useApi()
  const [id, setId] = useState("")

  return (
    <TestCard
      title="DELETE /system-healths/:id"
      description="Delete a system health record by ID"
    >
      <div className="space-y-2">
        <Input
          placeholder="System Health ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="destructive"
          onClick={() => id && call(`DELETE /system-healths/${id}`, () => fetch(`${API_BASE}/${id}`, { method: "DELETE" }))}
          disabled={!!loading || !id}
        >
          {loading === `DELETE /system-healths/${id}` ? "Deleting..." : "Delete"}
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

export default function SystemHealthsTestPanel() {
  return (
    <div className="space-y-6 p-4">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
          System Healths API Test Panel
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Backend: http://localhost:4000/system-healths
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ListSystemHealths />
        <GetSystemHealth />
        <CreateSystemHealth />
        <PatchSystemHealth />
        <PutSystemHealth />
        <DeleteSystemHealth />
      </div>
    </div>
  )
}