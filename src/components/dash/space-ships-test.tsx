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
import { Edit2, Trash2, Search, Loader2, Save, X, CheckCircle, AlertCircle, Plus } from "lucide-react";

const API_BASE = "http://localhost:4000";

interface Terminal {
  id: string;
  name: string;
  spaceShipId: string;
}

interface SpaceShip {
  id: string;
  name: string;
  terminals?: Terminal[];
}

interface SpaceShipsResponse {
  data: SpaceShip[];
}

export default function SpaceShipsTestPanel() {
  const [spaceShips, setSpaceShips] = useState<SpaceShip[]>([]);
  const [filteredSpaceShips, setFilteredSpaceShips] = useState<SpaceShip[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<SpaceShip>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createData, setCreateData] = useState<Partial<SpaceShip>>({
    name: "",
  });

  // Fetch space ships on mount
  useEffect(() => {
    fetchSpaceShips();
  }, []);

  const fetchSpaceShips = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/space-ships`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: SpaceShipsResponse = await res.json();
      setSpaceShips(data.data || []);
      setFilteredSpaceShips(data.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setSpaceShips([]);
      setFilteredSpaceShips([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter space ships based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSpaceShips(spaceShips);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredSpaceShips(
        spaceShips.filter(
          (ship) =>
            ship.name.toLowerCase().includes(term) ||
            ship.id.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, spaceShips]);

  const handleEditClick = (ship: SpaceShip) => {
    setEditingId(ship.id);
    setEditData({
      id: ship.id,
      name: ship.name,
    });
  };

  const handleSave = async (id: string) => {
    setSavingId(id);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/space-ships/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSuccess("Space Ship updated successfully");
      setEditingId(null);
      fetchSpaceShips();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update space ship";
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
      const res = await fetch(`${API_BASE}/space-ships/${deleteConfirmId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSuccess("Space Ship deleted successfully");
      fetchSpaceShips();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete space ship";
      setError(message);
    } finally {
      setDeletingId(null);
      setDeleteConfirmId(null);
    }
  };

  const handleCreateClick = () => {
    setCreateData({
      name: "",
    });
    setCreateModalOpen(true);
  };

  const handleCreate = async () => {
    setCreating(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/space-ships`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSuccess("Space Ship created successfully");
      setCreateModalOpen(false);
      fetchSpaceShips();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create space ship";
      setError(message);
    } finally {
      setCreating(false);
    }
  };

  const handleCancelCreate = () => {
    setCreateModalOpen(false);
    setCreateData({
      name: "",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-zinc-500" />
          Space Ships Management
        </CardTitle>
        <Button onClick={handleCreateClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Space Ship
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search input */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search space ships by name, id..."
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

        {/* Space Ships table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">ID</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">Name</th>
                <th className="text-right p-3 font-medium text-zinc-500 dark:text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center p-8 text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin h-5 w-5" />
                      Loading space ships...
                    </div>
                  </td>
                </tr>
              ) : filteredSpaceShips.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center p-8 text-zinc-500 dark:text-zinc-400">
                    {searchTerm ? "No space ships match your search" : "No space ships found"}
                  </td>
                </tr>
              ) : (
                filteredSpaceShips.map((ship) => (
                  <tr
                    key={ship.id}
                    className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                  >
                    <td className="p-3 font-mono text-xs text-zinc-600 dark:text-zinc-300">
                      {editingId === ship.id ? (
                        <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs">{ship.id}</span>
                      ) : (
                        <span>{ship.id}</span>
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === ship.id ? (
                        <Input
                          value={editData.name as string}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-zinc-900 dark:text-white">{ship.name}</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {editingId === ship.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleCancelEdit}
                            disabled={savingId === ship.id}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSave(ship.id)}
                            disabled={savingId === ship.id}
                          >
                            {savingId === ship.id ? (
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
                            onClick={() => handleEditClick(ship)}
                            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Dialog open={deleteConfirmId === ship.id} onOpenChange={(open) => open ? setDeleteConfirmId(ship.id) : setDeleteConfirmId(null)}>
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
                                <DialogTitle>Delete Space Ship</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete <strong>{ship.name}</strong> (ID: {ship.id})?
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
                                  disabled={deletingId === ship.id}
                                >
                                  {deletingId === ship.id ? (
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
          Showing {filteredSpaceShips.length} of {spaceShips.length} space ships
        </div>

        {/* Create Space Ship Modal */}
        <Dialog open={createModalOpen} onOpenChange={handleCancelCreate}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Space Ship</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new space ship.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
                <Input
                  value={createData.name as string}
                  onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                  placeholder="Space ship name"
                  required
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
                  "Create Space Ship"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}