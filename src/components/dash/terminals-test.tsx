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
import { Edit2, Trash2, Search, Loader2, Save, X, CheckCircle, AlertCircle, Plus, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const API_BASE = "http://localhost:4000";

interface Spaceship {
  id: string;
  name: string;
}

interface SpaceShipsResponse {
  data: Spaceship[];
}

interface Terminal {
  id: string;
  name: string;
  userAgent: string;
  spaceShipId?: string;
}

interface TerminalsResponse {
  data: Terminal[];
}

const SpaceshipSelect = ({ value, onChange, spaceships }: { value: string; onChange: (spaceShipId: string) => void; spaceships: Spaceship[] }) => {
  const currentSpaceship = spaceships.find((s) => s.id === value);
  const displayValue = currentSpaceship?.name || (value ? "—" : "[Aucun]");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between h-8 px-2 py-1 text-xs gap-1">
          <span>{displayValue}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" sideOffset={4}>
        <DropdownMenuItem onClick={() => onChange("")} className={value === "" ? "bg-accent" : ""}>
          [Aucun]
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {spaceships.map((ship) => (
          <DropdownMenuItem key={ship.id} onClick={() => onChange(ship.id)} className={value === ship.id ? "bg-accent" : ""}>
            {ship.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function TerminalsTestPanel() {
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [filteredTerminals, setFilteredTerminals] = useState<Terminal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Terminal>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createData, setCreateData] = useState<Partial<Terminal>>({
    name: "",
    userAgent: "",
    spaceShipId: "",
  });
  const [spaceships, setSpaceships] = useState<Spaceship[]>([]);

  // Fetch spaceships on mount
  const fetchSpaceships = async () => {
    try {
      const res = await fetch(`${API_BASE}/space-ships`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: SpaceShipsResponse = await res.json();
      setSpaceships(data.data || []);
    } catch (err) {
      console.error("Failed to fetch spaceships:", err);
    }
  };

  // Fetch terminals on mount
  useEffect(() => {
    fetchTerminals();
    fetchSpaceships();
  }, []);

  const fetchTerminals = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/terminals`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: TerminalsResponse = await res.json();
      setTerminals(data.data || []);
      setFilteredTerminals(data.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setTerminals([]);
      setFilteredTerminals([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter terminals based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTerminals(terminals);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredTerminals(
        terminals.filter(
          (terminal) =>
            terminal.name.toLowerCase().includes(term) ||
            terminal.userAgent.toLowerCase().includes(term) ||
            terminal.id.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, terminals]);

  const handleEditClick = (terminal: Terminal) => {
    setEditingId(terminal.id);
    setEditData({
      id: terminal.id,
      name: terminal.name,
      userAgent: terminal.userAgent,
      spaceShipId: terminal.spaceShipId || "",
    });
  };

  const handleSave = async (id: string) => {
    setSavingId(id);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/terminals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editData.name,
          userAgent: editData.userAgent,
          spaceShipId: editData.spaceShipId || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSuccess("Terminal updated successfully");
      setEditingId(null);
      fetchTerminals();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update terminal";
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
      const res = await fetch(`${API_BASE}/terminals/${deleteConfirmId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSuccess("Terminal deleted successfully");
      fetchTerminals();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete terminal";
      setError(message);
    } finally {
      setDeletingId(null);
      setDeleteConfirmId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleCreateClick = () => {
    setCreateData({
      name: "",
      userAgent: "",
      spaceShipId: "",
    });
    setCreateModalOpen(true);
  };

  const handleCreate = async () => {
    setCreating(true);
    setError(null);
    setSuccess(null);
    try {
      const body: { name: string; userAgent: string; spaceShipId?: string } = {
        name: createData.name || "",
        userAgent: createData.userAgent || "",
      };
      if (createData.spaceShipId?.trim()) {
        body.spaceShipId = createData.spaceShipId.trim();
      }

      const res = await fetch(`${API_BASE}/terminals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSuccess("Terminal created successfully");
      setCreateModalOpen(false);
      fetchTerminals();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create terminal";
      setError(message);
    } finally {
      setCreating(false);
    }
  };

  const handleCancelCreate = () => {
    setCreateModalOpen(false);
    setCreateData({
      name: "",
      userAgent: "",
      spaceShipId: "",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-zinc-500" />
          Terminals Management
        </CardTitle>
        <Button onClick={handleCreateClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Terminal
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search input */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search terminals by name, userAgent, id..."
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

        {/* Terminals table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">ID</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">Name</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">User Agent</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">Spaceship</th>
                <th className="text-right p-3 font-medium text-zinc-500 dark:text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin h-5 w-5" />
                      Loading terminals...
                    </div>
                  </td>
                </tr>
              ) : filteredTerminals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-zinc-500 dark:text-zinc-400">
                    {searchTerm ? "No terminals match your search" : "No terminals found"}
                  </td>
                </tr>
              ) : (
                filteredTerminals.map((terminal) => (
                  <tr
                    key={terminal.id}
                    className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                  >
                    <td className="p-3 font-mono text-xs text-zinc-600 dark:text-zinc-300">
                      {editingId === terminal.id ? (
                        <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs">{terminal.id}</span>
                      ) : (
                        terminal.id
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === terminal.id ? (
                        <Input
                          value={editData.name as string}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full"
                          autoFocus
                        />
                      ) : (
                        terminal.name
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === terminal.id ? (
                        <Input
                          value={editData.userAgent as string}
                          onChange={(e) => setEditData({ ...editData, userAgent: e.target.value })}
                          className="w-full"
                        />
                      ) : (
                        terminal.userAgent
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === terminal.id ? (
                        <SpaceshipSelect
                          value={editData.spaceShipId as string}
                          onChange={(spaceShipId) => setEditData({ ...editData, spaceShipId })}
                          spaceships={spaceships}
                        />
                      ) : (
                        <span className="text-zinc-600 dark:text-zinc-300">
                          {spaceships.find((s) => s.id === terminal.spaceShipId)?.name || terminal.spaceShipId || "—"}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {editingId === terminal.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleCancelEdit}
                            disabled={savingId === terminal.id}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSave(terminal.id)}
                            disabled={savingId === terminal.id}
                          >
                            {savingId === terminal.id ? (
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
                            onClick={() => handleEditClick(terminal)}
                            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Dialog open={deleteConfirmId === terminal.id} onOpenChange={handleCancelDelete}>
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
                                <DialogTitle>Delete Terminal</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete terminal <strong>{terminal.name}</strong> (ID: {terminal.id})?
                                  This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={handleCancelDelete}>
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={handleConfirmDelete}
                                  disabled={deletingId === terminal.id}
                                >
                                  {deletingId === terminal.id ? (
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
          Showing {filteredTerminals.length} of {terminals.length} terminals
        </div>

        {/* Create Terminal Modal */}
        <Dialog open={createModalOpen} onOpenChange={handleCancelCreate}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Terminal</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new terminal.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
                <Input
                  value={createData.name as string}
                  onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                  placeholder="Terminal name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">User Agent</label>
                <Input
                  value={createData.userAgent as string}
                  onChange={(e) => setCreateData({ ...createData, userAgent: e.target.value })}
                  placeholder="User agent string"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Spaceship (optional)</label>
                <SpaceshipSelect
                  value={createData.spaceShipId as string}
                  onChange={(spaceShipId) => setCreateData({ ...createData, spaceShipId })}
                  spaceships={spaceships}
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
                  "Create Terminal"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}