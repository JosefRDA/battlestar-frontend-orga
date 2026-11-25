"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Edit2, Trash2, Loader2, Save, Plus, ChevronDown } from "lucide-react";

const SystemSelect = ({ value, onChange, systems }: { value: string; onChange: (systemId: string) => void; systems: System[] }) => {
  const currentSystem = systems.find((s) => s.id === value);
  const displayValue = currentSystem?.name || (value ? "—" : "[Aucun]");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between h-8 px-2 py-1 text-xs gap-1">
          <span>{displayValue}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" sideOffset={4}>
        <DropdownMenuItem
          onClick={() => onChange("")}
          className={value === "" ? "bg-accent" : ""}
        >
          [Aucun]
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {systems.map((sys) => (
          <DropdownMenuItem
            key={sys.id}
            onClick={() => onChange(sys.id)}
            className={value === sys.id ? "bg-accent" : ""}
          >
            {sys.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const API_BASE = "http://localhost:4000";

interface PartType {
  id: string;
  name: string;
  description: string;
  systemId?: string;
}

interface System {
  id: string;
  name: string;
  order: number;
}

interface PartTypesResponse {
  data: PartType[];
}

interface SystemsResponse {
  data: System[];
}

export default function PartTypesTestPanel() {
  const [partTypes, setPartTypes] = useState<PartType[]>([]);
  const [filteredPartTypes, setFilteredPartTypes] = useState<PartType[]>([]);
  const [systems, setSystems] = useState<System[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<PartType>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createData, setCreateData] = useState({ name: "", description: "", systemId: "" });

  const fetchSystems = async () => {
    try {
      const res = await fetch(`${API_BASE}/systems`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: SystemsResponse = await res.json();
      setSystems(data.data || []);
    } catch (err) {
      console.error("Failed to fetch systems:", err);
    }
  };

  useEffect(() => {
    fetchPartTypes();
    fetchSystems();
  }, []);

  const fetchPartTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/part-types`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: PartTypesResponse = await res.json();
      setPartTypes(data.data || []);
      setFilteredPartTypes(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch part types");
      setPartTypes([]);
      setFilteredPartTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredPartTypes(
      partTypes.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.id.toLowerCase().includes(term) ||
          (p.systemId && systems.find((s) => s.id === p.systemId)?.name.toLowerCase().includes(term))
      )
    );
  }, [searchTerm, partTypes, systems]);

  const handleEditClick = (pt: PartType) => {
    setEditingId(pt.id);
    setEditData({ name: pt.name, description: pt.description, systemId: pt.systemId });
  };

  const handleSave = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/part-types/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error("Failed to update");
      setSuccess("Part type updated successfully");
      setEditingId(null);
      fetchPartTypes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await fetch(`${API_BASE}/part-types/${deleteConfirmId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setSuccess("Part type deleted");
      fetchPartTypes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await fetch(`${API_BASE}/part-types`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createData),
      });
      if (!res.ok) throw new Error("Failed to create");
      setSuccess("Part type created");
      setCreateModalOpen(false);
      setCreateData({ name: "", description: "", systemId: "" });
      fetchPartTypes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Part Types Management</CardTitle>
        <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Create
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Search name, description, ID, system..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {(error || success) && (
          <div className={`p-3 rounded text-sm ${error ? "bg-red-100" : "bg-green-100"}`}>
            {error || success}
          </div>
        )}
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Description</th>
              <th className="text-left p-2">Système lié</th>
              <th className="text-right p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center p-4"><Loader2 className="animate-spin inline" /></td></tr>
            ) : (
              filteredPartTypes.map((pt) => {
                const system = systems.find((s) => s.id === pt.systemId);
                return (
                  <tr key={pt.id} className="border-b">
                    <td className="p-2 font-mono">{pt.id}</td>
                    <td className="p-2">
                      {editingId === pt.id ? <Input value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} /> : pt.name}
                    </td>
                    <td className="p-2">
                      {editingId === pt.id ? <Input value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})} /> : pt.description}
                    </td>
                    <td className="p-2">
                      {editingId === pt.id ? (
                        <SystemSelect
                          value={editData.systemId || ""}
                          onChange={(systemId) => setEditData({...editData, systemId: systemId || undefined})}
                          systems={systems}
                        />
                      ) : (
                        system?.name || "—"
                      )}
                    </td>
                    <td className="p-2 text-right">
                      {editingId === pt.id ? (
                        <Button size="sm" onClick={() => handleSave(pt.id)}><Save className="h-4 w-4" /></Button>
                      ) : (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleEditClick(pt)}><Edit2 className="h-4 w-4" /></Button>
                          <Dialog open={deleteConfirmId === pt.id} onOpenChange={(open) => setDeleteConfirmId(open ? pt.id : null)}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Delete Part Type</DialogTitle>
                                <DialogDescription>Are you sure you want to delete this part type? This cannot be undone.</DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                                <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </CardContent>

      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Part Type</DialogTitle></DialogHeader>
          <Input placeholder="Name" value={createData.name} onChange={(e) => setCreateData({...createData, name: e.target.value})} />
          <Input placeholder="Description" value={createData.description} onChange={(e) => setCreateData({...createData, description: e.target.value})} />
          <div className="pt-2">
            <label className="text-xs text-muted-foreground mb-1 block">Système lié</label>
            <SystemSelect
              value={createData.systemId}
              onChange={(systemId) => setCreateData({...createData, systemId})}
              systems={systems}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleCreate} disabled={creating}>{creating ? "Creating..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}