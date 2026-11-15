"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, XCircle, ArrowRight, RefreshCw } from "lucide-react"

const API_BASE = "http://localhost:4000/parts"

export default function PartsTestPanel() {
  const [createdPartId, setCreatedPartId] = useState<string>("")
  const [partId, setPartId] = useState<string>("")

  // GET /parts
  const [loadAllLoading, setLoadAllLoading] = useState(false)
  const [loadAllResponse, setLoadAllResponse] = useState<string>("")
  const handleLoadAll = async () => {
    setLoadAllLoading(true)
    setLoadAllResponse("⏳ Load All Parts...")
    try {
      const res = await fetch(API_BASE)
      const data = await res.json()
      const status = res.ok ? "✅" : "❌"
      setLoadAllResponse(`${status} GET ${API_BASE}\nStatus: ${res.status}\n${JSON.stringify(data, null, 2)}`)
    } catch (err) {
      setLoadAllResponse(`❌ GET ${API_BASE}\nError: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoadAllLoading(false)
    }
  }

  // GET /parts/:id
  const [loadOneLoading, setLoadOneLoading] = useState(false)
  const [loadOneResp, setLoadOneResp] = useState<string>("")
  const handleLoadOne = async () => {
    if (!partId.trim()) return setLoadOneResp("❌ Enter a Part ID first")
    setLoadOneLoading(true)
    setLoadOneResp("⏳ Load One Part...")
    try {
      const res = await fetch(`${API_BASE}/${partId}`)
      const data = await res.json()
      const status = res.ok ? "✅" : "❌"
      setLoadOneResp(`${status} GET ${API_BASE}/${partId}\nStatus: ${res.status}\n${JSON.stringify(data, null, 2)}`)
    } catch (err) {
      setLoadOneResp(`❌ GET ${API_BASE}/${partId}\nError: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoadOneLoading(false)
    }
  }

  // POST /parts
  const [newPart, setNewPart] = useState({ rifd: "TEST-001", name: "Test Part", description: "Test description", picture: "", canBeUsedInIncidentsIds: "", canBeUsedInReparationIds: "" })
  const [createLoading, setCreateLoading] = useState(false)
  const [createResponse, setCreateResponse] = useState<string>("")
  const handleCreate = async () => {
    const body = {
      rifd: newPart.rifd,
      name: newPart.name,
      description: newPart.description,
      picture: newPart.picture || undefined,
      canBeUsedInIncidentsIds: newPart.canBeUsedInIncidentsIds ? newPart.canBeUsedInIncidentsIds.split(",").map(s => s.trim()) : undefined,
      canBeUsedInReparationIds: newPart.canBeUsedInReparationIds ? newPart.canBeUsedInReparationIds.split(",").map(s => s.trim()) : undefined,
    }
    setCreateLoading(true)
    setCreateResponse("⏳ Create Part...")
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      const status = res.ok ? "✅" : "❌"
      setCreateResponse(`${status} POST ${API_BASE}\nStatus: ${res.status}\n${JSON.stringify(data, null, 2)}`)
      // Extract ID from response
      try {
        const match = JSON.stringify(data).match(/"id"\s*:\s*"([^"]+)"/)
        if (match) {
          setCreatedPartId(match[1])
          setPartId(match[1])
        }
      } catch {}
    } catch (err) {
      setCreateResponse(`❌ POST ${API_BASE}\nError: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setCreateLoading(false)
    }
  }

  // PATCH /parts/:id
  const [patchData, setPatchData] = useState({ name: "", description: "", picture: "" })
  const [patchLoading, setPatchLoading] = useState(false)
  const [patchResponse, setPatchResponse] = useState<string>("")
  const handlePatch = async () => {
    if (!createdPartId) return setPatchResponse("❌ Create a part first or enter ID")
    const body = Object.fromEntries(
      Object.entries(patchData).filter(([, v]) => v !== "")
    )
    setPatchLoading(true)
    setPatchResponse("⏳ Patch Part...")
    try {
      const res = await fetch(`${API_BASE}/${createdPartId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      const status = res.ok ? "✅" : "❌"
      setPatchResponse(`${status} PATCH ${API_BASE}/${createdPartId}\nStatus: ${res.status}\n${JSON.stringify(data, null, 2)}`)
    } catch (err) {
      setPatchResponse(`❌ PATCH ${API_BASE}/${createdPartId}\nError: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setPatchLoading(false)
    }
  }

  // PUT /parts/:id
  const [putData, setPutData] = useState({ rifd: "TEST-002", name: "Updated Part", description: "Updated description", picture: "", canBeUsedInIncidentsIds: "", canBeUsedInReparationIds: "" })
  const [putLoading, setPutLoading] = useState(false)
  const [putResponse, setPutResponse] = useState<string>("")
  const handlePut = async () => {
    if (!createdPartId) return setPutResponse("❌ Create a part first or enter ID")
    const body = {
      rifd: putData.rifd,
      name: putData.name,
      description: putData.description,
      picture: putData.picture || undefined,
      canBeUsedInIncidentsIds: putData.canBeUsedInIncidentsIds ? putData.canBeUsedInIncidentsIds.split(",").map(s => s.trim()) : undefined,
      canBeUsedInReparationIds: putData.canBeUsedInReparationIds ? putData.canBeUsedInReparationIds.split(",").map(s => s.trim()) : undefined,
    }
    setPutLoading(true)
    setPutResponse("⏳ Put Part...")
    try {
      const res = await fetch(`${API_BASE}/${createdPartId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      const status = res.ok ? "✅" : "❌"
      setPutResponse(`${status} PUT ${API_BASE}/${createdPartId}\nStatus: ${res.status}\n${JSON.stringify(data, null, 2)}`)
    } catch (err) {
      setPutResponse(`❌ PUT ${API_BASE}/${createdPartId}\nError: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setPutLoading(false)
    }
  }

  // DELETE /parts/:id
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteResponse, setDeleteResponse] = useState<string>("")
  const handleDelete = async () => {
    if (!createdPartId) return setDeleteResponse("❌ Create a part first or enter ID")
    setDeleteLoading(true)
    setDeleteResponse("⏳ Delete Part...")
    try {
      const res = await fetch(`${API_BASE}/${createdPartId}`, { method: "DELETE" })
      const status = res.ok ? "✅" : "❌"
      let responseBody = ""
      if (res.status !== 204) {
        try {
          const data = await res.json()
          responseBody = `\n${JSON.stringify(data, null, 2)}`
        } catch {}
      }
      setDeleteResponse(`${status} DELETE ${API_BASE}/${createdPartId}\nStatus: ${res.status}${responseBody || " (No Content)"}`)
      if (res.ok) {
        setCreatedPartId("")
        setPartId("")
      }
    } catch (err) {
      setDeleteResponse(`❌ DELETE ${API_BASE}/${createdPartId}\nError: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setDeleteLoading(false)
    }
  }

  const responseStyle = {
    fontFamily: "monospace",
    fontSize: "12px",
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
    maxHeight: "300px",
    overflow: "auto" as const,
    background: "#1e1e1e",
    color: "#d4d4d4",
    padding: "12px",
    borderRadius: "6px",
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Parts API Test Panel
          </CardTitle>
          <CardDescription>
            Test all Parts routes against backend at <code className="text-xs bg-muted px-1 rounded">{API_BASE}</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 1. GET /parts */}
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
              <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                1. GET /parts — List all parts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleLoadAll}
                disabled={loadAllLoading}
                className="w-full sm:w-auto"
              >
                {loadAllLoading ? (
                  <> <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading... </>
                ) : (
                  "Load All Parts"
                )}
              </Button>
              <pre style={responseStyle}>{loadAllResponse || "Click button to test"}</pre>
            </CardContent>
          </Card>

          {/* 2. GET /parts/:id */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="bg-green-50 dark:bg-green-900/20">
              <CardTitle className="text-green-900 dark:text-green-100 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                2. GET /parts/:id — Get one part
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                <Input
                  placeholder="Part ID"
                  value={partId}
                  onChange={(e) => setPartId(e.target.value)}
                  className="flex-1 min-w-[200px]"
                />
                <Button onClick={handleLoadOne} disabled={loadOneLoading}>
                  {loadOneLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get Part"}
                </Button>
              </div>
              <pre style={responseStyle}>{loadOneResp || "Enter ID and click Get Part"}</pre>
            </CardContent>
          </Card>

          {/* 3. POST /parts */}
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
              <CardTitle className="text-purple-900 dark:text-purple-100 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                3. POST /parts — Create part
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder="rifd (required)"
                  value={newPart.rifd}
                  onChange={(e) => setNewPart({ ...newPart, rifd: e.target.value })}
                />
                <Input
                  placeholder="name (required)"
                  value={newPart.name}
                  onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
                />
                <Input
                  placeholder="description (required)"
                  value={newPart.description}
                  onChange={(e) => setNewPart({ ...newPart, description: e.target.value })}
                  className="sm:col-span-2"
                />
                <Input
                  placeholder="picture (optional)"
                  value={newPart.picture}
                  onChange={(e) => setNewPart({ ...newPart, picture: e.target.value })}
                />
                <Input
                  placeholder="incident IDs comma-separated (optional)"
                  value={newPart.canBeUsedInIncidentsIds}
                  onChange={(e) => setNewPart({ ...newPart, canBeUsedInIncidentsIds: e.target.value })}
                  className="sm:col-span-2"
                />
                <Input
                  placeholder="reparation IDs comma-separated (optional)"
                  value={newPart.canBeUsedInReparationIds}
                  onChange={(e) => setNewPart({ ...newPart, canBeUsedInReparationIds: e.target.value })}
                  className="sm:col-span-2"
                />
              </div>
              <Button onClick={handleCreate} disabled={createLoading} className="w-full sm:w-auto">
                {createLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Create Part"}
              </Button>
              <pre style={responseStyle}>{createResponse || "Fill fields and click Create Part"}</pre>
              {createdPartId && (
                <div className="text-xs text-green-600 dark:text-green-400">
                  Created Part ID: <code>{createdPartId}</code> — auto-filled below for update/delete
                </div>
              )}
            </CardContent>
          </Card>

          {/* 4. PATCH /parts/:id */}
          <Card className="border-amber-200 dark:border-amber-800">
            <CardHeader className="bg-amber-50 dark:bg-amber-900/20">
              <CardTitle className="text-amber-900 dark:text-amber-100 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                4. PATCH /parts/:id — Partial update
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder="name (optional)"
                  value={patchData.name}
                  onChange={(e) => setPatchData({ ...patchData, name: e.target.value })}
                />
                <Input
                  placeholder="description (optional)"
                  value={patchData.description}
                  onChange={(e) => setPatchData({ ...patchData, description: e.target.value })}
                />
                <Input
                  placeholder="picture (optional)"
                  value={patchData.picture}
                  onChange={(e) => setPatchData({ ...patchData, picture: e.target.value })}
                />
              </div>
              <Button onClick={handlePatch} disabled={patchLoading} variant="secondary" className="w-full sm:w-auto">
                {patchLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Patch Part"}
              </Button>
              <pre style={responseStyle}>{patchResponse || "Enter fields and click Patch Part"}</pre>
            </CardContent>
          </Card>

          {/* 5. PUT /parts/:id */}
          <Card className="border-indigo-200 dark:border-indigo-800">
            <CardHeader className="bg-indigo-50 dark:bg-indigo-900/20">
              <CardTitle className="text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                5. PUT /parts/:id — Full update
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder="rifd (required)"
                  value={putData.rifd}
                  onChange={(e) => setPutData({ ...putData, rifd: e.target.value })}
                />
                <Input
                  placeholder="name (required)"
                  value={putData.name}
                  onChange={(e) => setPutData({ ...putData, name: e.target.value })}
                />
                <Input
                  placeholder="description (required)"
                  value={putData.description}
                  onChange={(e) => setPutData({ ...putData, description: e.target.value })}
                  className="sm:col-span-2"
                />
                <Input
                  placeholder="picture (optional)"
                  value={putData.picture}
                  onChange={(e) => setPutData({ ...putData, picture: e.target.value })}
                />
                <Input
                  placeholder="incident IDs comma-separated (optional)"
                  value={putData.canBeUsedInIncidentsIds}
                  onChange={(e) => setPutData({ ...putData, canBeUsedInIncidentsIds: e.target.value })}
                  className="sm:col-span-2"
                />
                <Input
                  placeholder="reparation IDs comma-separated (optional)"
                  value={putData.canBeUsedInReparationIds}
                  onChange={(e) => setPutData({ ...putData, canBeUsedInReparationIds: e.target.value })}
                  className="sm:col-span-2"
                />
              </div>
              <Button onClick={handlePut} disabled={putLoading} className="w-full sm:w-auto">
                {putLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Put Part"}
              </Button>
              <pre style={responseStyle}>{putResponse || "Fill fields and click Put Part"}</pre>
            </CardContent>
          </Card>

          {/* 6. DELETE /parts/:id */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader className="bg-red-50 dark:bg-red-900/20">
              <CardTitle className="text-red-900 dark:text-red-100 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                6. DELETE /parts/:id — Delete part
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleDelete}
                disabled={deleteLoading}
                variant="destructive"
                className="w-full sm:w-auto"
              >
                {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Delete Part"}
              </Button>
              <pre style={responseStyle}>{deleteResponse || "Create a part first, then click Delete Part"}</pre>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}