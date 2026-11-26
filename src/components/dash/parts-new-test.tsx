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
import { Edit2, Trash2, Search, Loader2, Save, X, CheckCircle, AlertCircle, Plus, ChevronDown, Copy, Check, Maximize } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const API_BASE = "http://localhost:4000";

interface PartType {
  id: string;
  name: string;
  description: string;
  systemId?: string;
}

interface PartTypesResponse {
  data: PartType[];
}

interface Part {
  id: string;
  rifd: string;
  partQuality: number;
  partTypeId: string | null;
  partType?: {
    id: string;
    name: string;
  } | null;
  partEvents?: Array<{
    id: string;
    partId: string;
    eventType: string;
    eventDate: string;
    details: string | null;
  }>;
}

interface PartsResponse {
  data: Part[];
}

const PartTypeSelect = ({ value, onChange, partTypes }: { value: string; onChange: (partTypeId: string) => void; partTypes: PartType[] }) => {
  const currentPartType = partTypes.find((pt) => pt.id === value);
  const displayValue = currentPartType?.name || (value ? "—" : "[Aucun]");

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
        {partTypes.map((pt) => (
          <DropdownMenuItem
            key={pt.id}
            onClick={() => onChange(pt.id)}
            className={value === pt.id ? "bg-accent" : ""}
          >
            {pt.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function PartsNewTestPanel() {
  const [parts, setParts] = useState<Part[]>([]);
  const [partTypes, setPartTypes] = useState<PartType[]>([]);
  const [filteredParts, setFilteredParts] = useState<Part[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Part>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createData, setCreateData] = useState<Partial<Part>>({
    rifd: "",
    partQuality: 100,
    partTypeId: "",
  });
  const [copiedField, setCopiedField] = useState<{type: 'id' | 'rifd' | 'partType'; value: string} | null>(null);

  const handleCopy = async (value: string, type: 'id' | 'rifd' | 'partType') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField({ type, value });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const fetchPartTypes = async () => {
    try {
      const res = await fetch(`${API_BASE}/part-types`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: PartTypesResponse = await res.json();
      setPartTypes(data.data || []);
    } catch (err) {
      console.error("Failed to fetch part types:", err);
    }
  };

  // Fetch parts on mount
  useEffect(() => {
    fetchParts();
    fetchPartTypes();
  }, []);

  const fetchParts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/parts?full=true`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: PartsResponse = await res.json();
      setParts(data.data || []);
      setFilteredParts(data.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setParts([]);
      setFilteredParts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter parts based on search term (rifd, id, part type)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredParts(parts);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredParts(
        parts.filter(
          (part) =>
            part.rifd.toLowerCase().includes(term) ||
            part.id.toLowerCase().includes(term) ||
            part.partType?.name.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, parts]);

  const handleEditClick = (part: Part) => {
    setEditingId(part.id);
    setEditData({
      id: part.id,
      rifd: part.rifd,
      partQuality: part.partQuality,
      partTypeId: part.partTypeId || "",
    });
  };

  const handleSave = async (id: string) => {
    setSavingId(id);
    setError(null);
    setSuccess(null);
    try {
      const { id: _id, ...updateData } = editData;
      const res = await fetch(`${API_BASE}/parts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSuccess("Part updated successfully");
      setEditingId(null);
      fetchParts();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update part";
      setError(message);
    } finally {
      setSavingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    setDeletingId(deleteConfirmId);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/parts/${deleteConfirmId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSuccess("Part deleted successfully");
      fetchParts();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete part";
      setError(message);
    } finally {
      setDeletingId(null);
      setDeleteConfirmId(null);
    }
  };

  const handleCreateClick = () => {
    setCreateData({
      rifd: "",
      partQuality: 100,
      partTypeId: "",
    });
    setCreateModalOpen(true);
  };

  const handleCreate = async () => {
    setCreating(true);
    setError(null);
    setSuccess(null);
    try {
      const body = {
        rifd: createData.rifd,
        partQuality: createData.partQuality,
        ...(createData.partTypeId && { partTypeId: createData.partTypeId }),
      };
      const res = await fetch(`${API_BASE}/parts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSuccess("Part created successfully");
      setCreateModalOpen(false);
      fetchParts();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create part";
      setError(message);
    } finally {
      setCreating(false);
    }
  };

  const handleCancelCreate = () => {
    setCreateModalOpen(false);
    setCreateData({
      rifd: "",
      partQuality: 100,
      partTypeId: "",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-zinc-500" />
          Parts Management (New Model)
        </CardTitle>
        <Button onClick={handleCreateClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Part
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search input */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search parts by rifd, id, part type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status messages */}
        {(error || success) && (
          <div
            className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
              error ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300" :
              "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
            }`}
          >
            {error ? <AlertCircle className="h-4 w-4 flex-shrink-0" /> : <CheckCircle className="h-4 w-4 flex-shrink-0" />}
            <span>{error || success}</span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-6 w-6"
              onClick={() => { setError(null); setSuccess(null); }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Parts table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">ID</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">RIFD</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">Quality</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">Part Type</th>
                <th className="text-right p-3 font-medium text-zinc-500 dark:text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin h-5 w-5" />
                      Loading parts...
                    </div>
                  </td>
                </tr>
              ) : filteredParts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-zinc-500 dark:text-zinc-400">
                    {searchTerm ? "No parts match your search" : "No parts found"}
                  </td>
                </tr>
              ) : (
                filteredParts.map((part) => (
                  <tr
                    key={part.id}
                    className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                  >
                    <td className="p-3 font-mono text-xs text-zinc-600 dark:text-zinc-300">
                      <div className="flex items-center gap-1">
                        {editingId === part.id ? (
                          <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs">{part.id}</span>
                        ) : (
                          <span>{part.id}</span>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                          onClick={() => handleCopy(part.id, 'id')}
                          aria-label="Copy ID"
                        >
                          {copiedField?.type === 'id' && copiedField?.value === part.id ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-xs text-zinc-600 dark:text-zinc-300">
                      <div className="flex items-center gap-1">
                        {editingId === part.id ? (
                          <Input
                            value={editData.rifd as string}
                            onChange={(e) => setEditData({ ...editData, rifd: e.target.value })}
                            className="w-full"
                          />
                        ) : (
                          <span>{part.rifd}</span>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                          onClick={() => handleCopy(part.rifd, 'rifd')}
                          aria-label="Copy RIFD"
                        >
                          {copiedField?.type === 'rifd' && copiedField?.value === part.rifd ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </td>
                    <td className="p-3">
                      {editingId === part.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={editData.partQuality as number}
                            onChange={(e) => setEditData({ ...editData, partQuality: Math.min(parseInt(e.target.value) || 0, 100) })}
                            className="w-full"
                            min="0"
                            max="100"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                            onClick={() => setEditData({ ...editData, partQuality: 100 })}
                          >
                            <Maximize className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-zinc-600 dark:text-zinc-300">{part.partQuality}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {editingId === part.id ? (
                          <PartTypeSelect
                            value={editData.partTypeId as string}
                            onChange={(partTypeId) => setEditData({ ...editData, partTypeId })}
                            partTypes={partTypes}
                          />
                        ) : (
                          <span className="text-zinc-600 dark:text-zinc-300">{part.partType?.name || "—"}</span>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                          onClick={() => handleCopy(part.partType?.name || "—", 'partType')}
                          aria-label="Copy Part Type"
                        >
                          {copiedField?.type === 'partType' && copiedField?.value === (part.partType?.name || "—") ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      {editingId === part.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleCancelEdit}
                            disabled={savingId === part.id}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSave(part.id)}
                            disabled={savingId === part.id}
                          >
                            {savingId === part.id ? (
                              <Loader2 className="animate-spin h-3.5 w-3.5" />
                            ) : (
                              <Save className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(part)}
                            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Dialog open={deleteConfirmId === part.id} onOpenChange={(open) => open ? setDeleteConfirmId(part.id) : setDeleteConfirmId(null)}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Delete Part</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete <strong>{part.rifd}</strong> (ID: {part.id})?
                                  This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={handleConfirmDelete}
                                  disabled={deletingId === part.id}
                                >
                                  {deletingId === part.id ? (
                                    <>
                                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                      Deleting...
                                    </>
                                  ) : (
                                    "Delete"
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Results count */}
        <div className="text-xs text-zinc-500 dark:text-zinc-400 text-right">
          Showing {filteredParts.length} of {parts.length} parts
        </div>

        {/* Create Part Modal */}
        <Dialog open={createModalOpen} onOpenChange={handleCancelCreate}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Part</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new part.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">RIFD (required)</label>
                <Input
                  value={createData.rifd as string}
                  onChange={(e) => setCreateData({ ...createData, rifd: e.target.value })}
                  placeholder="e.g., PART-001"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Quality (required)</label>
                <Input
                  type="number"
                  value={createData.partQuality as number}
                  onChange={(e) => setCreateData({ ...createData, partQuality: Math.min(parseInt(e.target.value) || 0, 100) })}
                  placeholder="1"
                  min="0"
                  max="100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Part Type (optional)</label>
                <PartTypeSelect
                  value={createData.partTypeId as string}
                  onChange={(partTypeId) => setCreateData({ ...createData, partTypeId })}
                  partTypes={partTypes}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelCreate} disabled={creating}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Part"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}