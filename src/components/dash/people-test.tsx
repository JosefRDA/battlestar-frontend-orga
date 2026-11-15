"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

export default function PeopleTestPanel() {
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [personId, setPersonId] = useState("")
    const [personRifd, setPersonRifd] = useState("")
    const [personData, setPersonData] = useState({ name: "Test Person", sexe: "MASCULIN", adulte: true })

    const baseUrl = "http://localhost:4000"

    const runTest = async (method: string, path: string, body?: any) => {
        setLoading(true)
        setResult(null)
        try {
            const options: RequestInit = {
                method,
                headers: { "Content-Type": "application/json" },
                ...(body && { body: JSON.stringify(body) })
            }
            const res = await fetch(`${baseUrl}${path}`, options)
            let data
            try {
                data = await res.json()
            } catch {
                data = { statusText: res.statusText }
            }
            setResult({ status: res.status, data })
        } catch (err: any) {
            setResult({ status: "Error", data: err.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>People API Tester</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="list" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="list">List</TabsTrigger>
                        <TabsTrigger value="get">Get/Health</TabsTrigger>
                        <TabsTrigger value="mutate">Create/Update/Delete</TabsTrigger>
                    </TabsList>

                    <TabsContent value="list" className="space-y-4">
                        <Button onClick={() => runTest("GET", "/people")}>GET /people</Button>
                    </TabsContent>

                    <TabsContent value="get" className="space-y-4">
                        <div className="flex gap-2">
                            <Input placeholder="Person ID" value={personId} onChange={(e) => setPersonId(e.target.value)} />
                            <Button onClick={() => runTest("GET", `/people/${personId}`)}>GET /people/:id</Button>
                            <Button onClick={() => runTest("GET", `/people/${personId}/health/latest`)}>GET /people/:id/health/latest</Button>
                        </div>
                        <div className="flex gap-2">
                            <Input placeholder="RIFD" value={personRifd} onChange={(e) => setPersonRifd(e.target.value)} />
                            <Button onClick={() => runTest("GET", `/people/rifd/${personRifd}/health/latest`)}>GET /people/rifd/:rifd/health/latest</Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="mutate" className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <Input placeholder="Name" value={personData.name} onChange={(e) => setPersonData({...personData, name: e.target.value})} />
                            <Button onClick={() => runTest("POST", "/people", personData)}>POST /people</Button>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Input placeholder="ID for PATCH/PUT/DELETE" value={personId} onChange={(e) => setPersonId(e.target.value)} className="w-64" />
                            <Button onClick={() => runTest("PATCH", `/people/${personId}`, personData)}>PATCH /people/:id</Button>
                            <Button onClick={() => runTest("PUT", `/people/${personId}`, personData)}>PUT /people/:id</Button>
                            <Button variant="destructive" onClick={() => runTest("DELETE", `/people/${personId}`)}>DELETE /people/:id</Button>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg min-h-[100px]">
                    {loading ? (
                        <div className="flex items-center gap-2 text-zinc-500">
                            <Loader2 className="animate-spin w-4 h-4" /> Loading...
                        </div>
                    ) : result ? (
                        <pre className="text-xs overflow-auto whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
                    ) : (
                        <span className="text-sm text-zinc-500">No requests made yet.</span>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
