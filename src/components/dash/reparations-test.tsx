"use client"

import { useState } from "react"
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const API_BASE = "http://localhost:4000/reparations"

interface TestCase {
  id: string
  title: string
  description: string
  method: string
  endpoint: string
  needsId: boolean
  needsSystemId: boolean
  needsBody: boolean
  bodyFields: { key: string; type: "text" | "checkbox" | "number" | "array"; label: string; placeholder?: string }[]
}

const testCases: TestCase[] = [
  {
    id: "list",
    title: "GET /reparations",
    description: "List all reparations",
    method: "GET",
    endpoint: "",
    needsId: false,
    needsSystemId: false,
    needsBody: false,
    bodyFields: [],
  },
  {
    id: "get",
    title: "GET /reparations/:id",
    description: "Get one reparation by ID",
    method: "GET",
    endpoint: "/:id",
    needsId: true,
    needsSystemId: false,
    needsBody: false,
    bodyFields: [],
  },
  {
    id: "get-by-system",
    title: "GET /reparations/system/:systemId",
    description: "Get active reparation for system",
    method: "GET",
    endpoint: "/system/:systemId",
    needsId: false,
    needsSystemId: true,
    needsBody: false,
    bodyFields: [],
  },
  {
    id: "create",
    title: "POST /reparations",
    description: "Create a new reparation",
    method: "POST",
    endpoint: "",
    needsId: false,
    needsSystemId: false,
    needsBody: true,
    bodyFields: [
      { key: "systemId", type: "number", label: "System ID (required)", placeholder: "1" },
      { key: "partsNeededToFixIds", type: "array", label: "Parts IDs (comma-separated)", placeholder: "part-id-1,part-id-2" },
    ],
  },
  {
    id: "patch",
    title: "PATCH /reparations/:id",
    description: "Partial update reparation",
    method: "PATCH",
    endpoint: "/:id",
    needsId: true,
    needsSystemId: false,
    needsBody: true,
    bodyFields: [
      { key: "systemId", type: "number", label: "System ID", placeholder: "2" },
      { key: "fixed", type: "checkbox", label: "Fixed" },
      { key: "partsNeededToFixIds", type: "array", label: "Parts IDs (comma-separated)", placeholder: "part-id-1,part-id-2" },
    ],
  },
  {
    id: "put",
    title: "PUT /reparations/:id",
    description: "Full update reparation",
    method: "PUT",
    endpoint: "/:id",
    needsId: true,
    needsSystemId: false,
    needsBody: true,
    bodyFields: [
      { key: "systemId", type: "number", label: "System ID (required)", placeholder: "1" },
      { key: "fixed", type: "checkbox", label: "Fixed" },
      { key: "partsNeededToFixIds", type: "array", label: "Parts IDs (comma-separated)", placeholder: "part-id-1,part-id-2" },
    ],
  },
  {
    id: "delete",
    title: "DELETE /reparations/:id",
    description: "Delete a reparation",
    method: "DELETE",
    endpoint: "/:id",
    needsId: true,
    needsSystemId: false,
    needsBody: false,
    bodyFields: [],
  },
  {
    id: "fix",
    title: "POST /reparations/:id/fix",
    description: "Mark reparation as fixed",
    method: "POST",
    endpoint: "/:id/fix",
    needsId: true,
    needsSystemId: false,
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
  const [systemId, setSystemId] = useState("")
  const [body, setBody] = useState<Record<string, string | boolean | number>>({})

  const handleInputChange = (key: string, value: string | boolean | number) => {
    setBody((prev) => ({ ...prev, [key]: value }))
  }

  const runTest = async () => {
    setResponse({ status: "loading" })
    try {
      const url = `${API_BASE}${testCase.endpoint.replace(":id", id).replace(":systemId", systemId)}`
      const options: RequestInit = {
        method: testCase.method,
        headers: { "Content-Type": "application/json" },
      }

      if (testCase.needsBody && Object.keys(body).length > 0) {
        const parsedBody: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(body)) {
          if (value === "") continue
          if (key === "fixed") parsedBody[key] = value === "true" || value === true
          else if (key === "systemId") parsedBody[key] = Number(value)
          else if (key === "partsNeededToFixIds") {
            if (typeof value === "string" && value.trim()) {
              parsedBody[key] = value.split(",").map((s) => s.trim()).filter(Boolean)
            }
          }
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
            <Label className="text-xs text-muted-foreground">Reparation ID</Label>
            <Input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter reparation ID..."
              disabled={isRunning}
            />
          </div>
        )}
        {testCase.needsSystemId && (
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">System ID</Label>
            <Input
              type="number"
              value={systemId}
              onChange={(e) => setSystemId(e.target.value)}
              placeholder="Enter system ID..."
              disabled={isRunning}
            />
          </div>
        )}
        {testCase.needsBody && testCase.bodyFields.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Request Body</Label>
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
                        type={field.type === "number" ? "number" : field.type === "array" ? "text" : field.type}
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
          disabled={isRunning || (testCase.needsId && !id) || (testCase.needsSystemId && !systemId)}
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

export default function ReparationsTestPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">Reparations API Tests</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Test all reparations endpoints against <code className="font-mono text-primary bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">http://localhost:4000/reparations</code>
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