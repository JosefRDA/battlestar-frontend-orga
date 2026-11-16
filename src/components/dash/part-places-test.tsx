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

interface PartPlace {
  id: string;
  name: string;
  type: "Monte" | "Reserve" | "Autre";
  createdAt: string;
  updatedAt: string;
}

interface PartPlacesResponse {
  data: PartPlace[];
}

export default function PartPlacesTestPanel() {
  const [partPlaces, setPartPlaces] = useState<PartPlace[]>([]);
  const [filteredPartPlaces, setFilteredPartPlaces] = useState<PartPlace[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<PartPlace>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createData, setCreateData] = useState<Partial<PartPlace>>({
    name: "",
    type: "Monte",
  });

  // Fetch part places on mount
  useEffect(() => {
    fetchPartPlaces();
  }, []);

  const fetchPartPlaces = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/part-places`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: PartPlacesResponse = await res.json();
      setPartPlaces(data.data || []);
      setFilteredPartPlaces(data.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setPartPlaces([]);
      setFilteredPartPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter part places based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPartPlaces(partPlaces);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredPartPlaces(
        partPlaces.filter(
          (partPlace) =>
            partPlace.name.toLowerCase().includes(term) ||
            partPlace.type.toLowerCase().includes(term) ||
            partPlace.id.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, partPlaces]);

  const handleEditClick = (partPlace: PartPlace) => {
    setEditingId(partPlace.id);
    setEditData({
      name: partPlace.name,
      type: partPlace.type,
    });
  };

  const handleSave = async (id: string) => {
    setSavingId(id);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/part-places/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSuccess("Part place updated successfully");
      setEditingId(null);
      fetchPartPlaces();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update part place";
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
      const res = await fetch(`${API_BASE}/part-places/${deleteConfirmId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      if (res.status !== 204) {
        setSuccess("Part place deleted successfully");
      }
      fetchPartPlaces();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete part place";
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
      type: "Monte",
    });
    setCreateModalOpen(true);
  };

  const handleCreate = async () => {
    setCreating(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/part-places`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSuccess("Part place created successfully");
      setCreateModalOpen(false);
      fetchPartPlaces();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create part place";
      setError(message);
    } finally {
      setCreating(false);
    }
  };

  const handleCancelCreate = () => {
    setCreateModalOpen(false);
    setCreateData({
      name: "",
      type: "Monte",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-zinc-500" />
          Part Places Management
        </CardTitle>
        <Button onClick={handleCreateClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Part Place
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search input */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search part places by name, type, id..."
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

        {/* Part places table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">ID</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">Name</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">Type</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">Created At</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">Updated At</th>
                <th className="text-right p-3 font-medium text-zinc-500 dark:text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin h-5 w-5" />
                      Loading part places...
                    </div>
                  </td>
                </tr>
              ) : filteredPartPlaces.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-zinc-500 dark:text-zinc-400">
                    {searchTerm ? "No part places match your search" : "No part places found"}
                  </td>
                </tr>
              ) : (
                filteredPartPlaces.map((partPlace) => (
                  <tr
                    key={partPlace.id}
                    className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                  >
                    <td className="p-3 font-mono text-xs text-zinc-600 dark:text-zinc-300">
                      {partPlace.id}
                    </td>
                    <td className="p-3">
                      {editingId === partPlace.id ? (
                        <Input
                          value={editData.name as string}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full"
                          autoFocus
                          placeholder="Part place name"
                        />
                      ) : (
                        <span className="font-medium text-zinc-900 dark:text-white">{partPlace.name}</span>
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === partPlace.id ? (
                        <div className="space-y-2">
                          <Input
                            value={editData.type as string}
                            onChange={(e) => setEditData({ ...editData, type: e.target.value as "Monte" | "Reserve" | "Autre" })}
                            placeholder="Type (Monte, Reserve, Autre)"
                            className="w-full"
                          />
                          <div className="flex gap-1 flex-wrap">
                            {["Monte", "Reserve", "Autre"].map((option) => (
                              <Button
                                key={option}
                                variant={editData.type === option ? "default" : "outline"}
                                size="sm"
                                onClick={() => setEditData({ ...editData, type: option as "Monte" | "Reserve" | "Autre" })}
                                className="text-xs"
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-zinc-600 dark:text-zinc-300">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            partPlace.type === "Monte"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              : partPlace.type === "Reserve"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                          }`}
                          >
                            {partPlace.type}
                          </span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-xs text-zinc-500 dark:text-zinc-400">
                      {partPlace.createdAt ? new Date(partPlace.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-3 text-xs text-zinc-500 dark:text-zinc-400">
                      {partPlace.updatedAt ? new Date(partPlace.updatedAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-3 text-right">
                      {editingId === partPlace.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleCancelEdit}
                            disabled={savingId === partPlace.id}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSave(partPlace.id)}
                            disabled={savingId === partPlace.id}
                          >
                            {savingId === partPlace.id ? (
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
                            onClick={() => handleEditClick(partPlace)}
                            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Dialog open={deleteConfirmId === partPlace.id} onOpenChange={handleCancelDelete}>
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
                                <DialogTitle>Delete Part Place</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete <strong>{partPlace.name}</strong>?
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
                                  disabled={deletingId === partPlace.id}
                                >
                                  {deletingId === partPlace.id ? (
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
          Showing {filteredPartPlaces.length} of {partPlaces.length} part places
        </div>

        {/* Create Part Place Modal */}
        <Dialog open={createModalOpen} onOpenChange={handleCancelCreate}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Part Place</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new part place.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
                <Input
                  value={createData.name as string}
                  onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                  placeholder="e.g., Part Place 001"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Type</label>
                <div className="flex gap-2">
                  {["Monte", "Reserve", "Autre"].map((option) => (
                    <Button
                      key={option}
                      variant={createData.type === option ? "default" : "outline"}
                      onClick={() => setCreateData({ ...createData, type: option as "Monte" | "Reserve" | "Autre" })}
                      className="flex-1"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                <Input
                  value={createData.type as string}
                  onChange={(e) => setCreateData({ ...createData, type: e.target.value as "Monte" | "Reserve" | "Autre" })}
                  placeholder="Type (Monte, Reserve, Autre) - editable"
                  className="mt-2"
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
                  "Create Part Place"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}