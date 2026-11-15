"use client"

import { useState } from "react"
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const API_BASE = "http://localhost:4000/hacks"

interface TestCase {
  id: string
  title: string
  description: string
  method: string
  endpoint: string
  needsId: boolean
  needsBody: boolean
  bodyFields: { key: string; type: "text" | "checkbox" | "date"; label: string; placeholder?: string }[]
}

const testCases: TestCase[] = [
  {
    id: "list",
    title: "GET /hacks",
    description: "List all hackings",
    method: "GET",
    endpoint: "",
    needsId: false,
    needsBody: false,
    bodyFields: [],
  },
  {
    id: "get",
    title: "GET /hacks/:id",
    description: "Get one hacking by ID",
    method: "GET",
    endpoint: "/:id",
    needsId: true,
    needsBody: false,
    bodyFields: [],
  },
  {
    id: "create",
    title: "POST /hacks",
    description: "Create a new hacking",
    method: "POST",
    endpoint: "",
    needsId: false,
    needsBody: true,
    bodyFields: [
      { key: "testOrga", type: "checkbox", label: "Test Organization" },
    ],
  },
  {
    id: "start",
    title: "POST /hacks/:id/start",
    description: "Start a hacking",
    method: "POST",
    endpoint: "/:id/start",
    needsId: true,
    needsBody: false,
    bodyFields: [],
  },
  {
    id: "stop",
    title: "POST /hacks/:id/stop",
    description: "Stop a hacking",
    method: "POST",
    endpoint: "/:id/stop",
    needsId: true,
    needsBody: false,
    bodyFields: [],
  },
  {
    id: "patch",
    title: "PATCH /hacks/:id",
    description: "Partial update hacking",
    method: "PATCH",
    endpoint: "/:id",
    needsId: true,
    needsBody: true,
    bodyFields: [
      { key: "testOrga", type: "checkbox", label: "Test Organization" },
      { key: "stopedAt", type: "date", label: "Stop Date (ISO)", placeholder: "2024-01-15T10:30:00.000Z" },
    ],
  },
  {
    id: "put",
    title: "PUT /hacks/:id",
    description: "Full update hacking",
    method: "PUT",
    endpoint: "/:id",
    needsId: true,
    needsBody: true,
    bodyFields: [
      { key: "testOrga", type: "checkbox", label: "Test Organization" },
      { key: "stopedAt", type: "date", label: "Stop Date (ISO)", placeholder: "2024-01-15T10:30:00.000Z" },
    ],
  },
  {
    id: "delete",
    title: "DELETE /hacks/:id",
    description: "Delete a hacking",
    method: "DELETE",
    endpoint: "/:id",
    needsId: true,
    needsBody: false,
    bodyFields: [],
  },
]

type ResponseState = {
  status: "idle" | "loading" | "success" | "error"
  data?: unknown
  error?: string
}

function formatJson(obj: unknown): string {
  return JSON.stringify(obj, null, 2)
}

function TestCard({ testCase }: { testCase: TestCase }) {
  const [response, setResponse] = useState<ResponseState>({ status: "idle" })
  const [id, setId] = useState("")
  const [body, setBody] = useState<Record<string, string | boolean>>({})

  const handleInputChange = (key: string, value: string | boolean) => {
    setBody((prev) => ({ ...prev, [key]: value }))
  }

  const runTest = async () => {
    setResponse({ status: "loading" })
    try {
      const url = `${API_BASE}${testCase.endpoint.replace(":id", id)}`
      const options: RequestInit = {
        method: testCase.method,
        headers: { "Content-Type": "application/json" },
      }

      if (testCase.needsBody && Object.keys(body).length > 0) {
        const parsedBody: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(body)) {
          if (value === "") continue
          if (key === "testOrga") parsedBody[key] = value === "true" || value === true
          else if (key === "stopedAt") parsedBody[key] = value
          else parsedBody[key] = value
        }
        options.body = JSON.stringify(parsedBody)
      }

      const res = await fetch(url, options)
      const data = res.status !== 204 ? await res.json() : { success: true }

      if (!res.ok) {
        throw new Error(data.message || `HTTP ${res.status}`)
      }

      if (testCase.id === "create" && data.data?.id) {
        setId(data.data.id)
      }

      setResponse({ status: "success", data })
    } catch (err) {
      setResponse({ status: "error", error: err instanceof Error ? err.message : "Unknown error" })
    }
  }

  const isRunning = response.status === "loading"
  const isSuccess = response.status === "success"
  const isError = response.status === "error"

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-mono text-primary">{testCase.title}</CardTitle>
            <CardDescription className="text-xs">{testCase.description}</CardDescription>
          </div>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${
            testCase.method === "GET" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
            testCase.method === "POST" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
            testCase.method === "PATCH" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
            testCase.method === "PUT" ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" :
            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            {testCase.method}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {testCase.needsId && (
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Hacking ID</label>
            <Input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter hacking ID..."
              disabled={isRunning}
            />
          </div>
        )}
        {testCase.needsBody && testCase.bodyFields.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Request Body</label>
            <div className="space-y-2">
              {testCase.bodyFields.map((field) => (
                <div key={field.key} className="flex items-center gap-2">
                  {field.type === "checkbox" ? (
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={body[field.key] === "true" || body[field.key] === true}
                        onChange={(e) => handleInputChange(field.key, e.target.checked)}
                        disabled={isRunning}
                        className="w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary"
                      />
                      <span>{field.label}</span>
                    </label>
                  ) : (
                    <div className="flex-1">
                      <Input
                        type={field.type}
                        value={(body[field.key] as string) || ""}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        disabled={isRunning}
                        className="text-xs"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <Button
          onClick={runTest}
          disabled={isRunning || (testCase.needsId && !id)}
          className="w-full justify-start gap-2"
          size="sm"
        >
          {isRunning && <Loader2 className="w-4 h-4 animate-spin" />}
          {!isRunning && <RefreshCw className="w-4 h-4" />}
          {isRunning ? "Running..." : "Execute"}
        </Button>

        <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          {isSuccess && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>Success</span>
            </div>
          )}
          {isError && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
              <XCircle className="w-4 h-4 flex-shrink-0" />
              <span>{response.error}</span>
            </div>
          )}
          {(isSuccess || isError) && response.data ? (
            <div className="relative">
              <pre className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 text-xs overflow-x-auto max-h-64 text-zinc-900 dark:text-zinc-100">
                {formatJson(response.data)}
              </pre>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

export default function HackingsTestPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">Hackings API Tests</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Test all hackings endpoints against <code className="font-mono text-primary bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">http://localhost:4000/hacks</code>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testCases.map((tc) => (
          <TestCard key={tc.id} testCase={tc} />
        ))}
      </div>
    </div>
  )
}