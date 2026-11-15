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
import { Edit2, Trash2, Search, Loader2, Save, X, CheckCircle, AlertCircle, Plus, Copy, Check } from "lucide-react";

const API_BASE = "http://localhost:4000";

interface User {
  id: string;
  rifd: string;
  name: string;
  role: string[];
  picture: string;
  isHacker: boolean;
  people?: {
    id: string;
    name: string;
    sexe: string;
    adulte: boolean;
    mort: boolean;
  } | null;
}

interface UsersResponse {
  data: User[];
}

export default function UsersTestPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<User>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createData, setCreateData] = useState<Partial<User>>({
    rifd: "",
    name: "",
    role: [],
    picture: "",
    isHacker: false,
  });
  const [copiedField, setCopiedField] = useState<{ type: 'id' | 'rifd' | 'name'; value: string } | null>(null);

  const handleCopy = async (value: string, type: 'id' | 'rifd' | 'name') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField({ type, value });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: UsersResponse = await res.json();
      setUsers(data.data || []);
      setFilteredUsers(data.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name.toLowerCase().includes(term) ||
            user.rifd.toLowerCase().includes(term) ||
            user.id.toLowerCase().includes(term) ||
            user.role.some((r) => r.toLowerCase().includes(term)) ||
            (user.people?.name.toLowerCase().includes(term) ?? false)
        )
      );
    }
  }, [searchTerm, users]);

  const handleEditClick = (user: User) => {
    setEditingId(user.id);
    setEditData({
      rifd: user.rifd,
      name: user.name,
      role: user.role,
      picture: user.picture,
      isHacker: user.isHacker,
    });
  };

  const handleSave = async (id: string) => {
    setSavingId(id);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSuccess("User updated successfully");
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update user";
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
      const res = await fetch(`${API_BASE}/users/${deleteConfirmId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSuccess("User deleted successfully");
      fetchUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete user";
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
      rifd: "",
      name: "",
      role: [],
      picture: "",
      isHacker: false,
    });
    setCreateModalOpen(true);
  };

  const handleCreate = async () => {
    setCreating(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSuccess("User created successfully");
      setCreateModalOpen(false);
      fetchUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create user";
      setError(message);
    } finally {
      setCreating(false);
    }
  };

  const handleCancelCreate = () => {
    setCreateModalOpen(false);
    setCreateData({
      rifd: "",
      name: "",
      role: [],
      picture: "",
      isHacker: false,
    });
  };

  const formatRole = (role: string[]) => role.join(", ") || "—";

  const formatPicture = (picture: string) =>
    picture ? (
      <div
        className="w-8 h-8 rounded-full bg-cover bg-center"
        style={{ backgroundImage: `url(${picture})` }}
      />
    ) : (
      <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">—</span>
      </div>
    );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-zinc-500" />
          Users Management
        </CardTitle>
        <Button onClick={handleCreateClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau User
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search input */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search users by name, rifd, id, role..."
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

        {/* Users table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">ID</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">RIFD</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">Name</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">Role(s)</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">Picture</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">Hacker</th>
                <th className="text-left p-3 font-medium text-zinc-500 dark:text-zinc-400">People</th>
                <th className="text-right p-3 font-medium text-zinc-500 dark:text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin h-5 w-5" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-zinc-500 dark:text-zinc-400">
                    {searchTerm ? "No users match your search" : "No users found"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                  >
                    <td className="p-3 font-mono text-xs text-zinc-600 dark:text-zinc-300">
                      {editingId === user.id ? (
                        <Input
                          value={editData.id as string}
                          onChange={(e) => setEditData({ ...editData, id: e.target.value })}
                          className="w-full"
                          readOnly
                        />
                      ) : (
                        <div className="flex items-center gap-1">
                          <span>{user.id}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                            onClick={() => handleCopy(user.id, 'id')}
                            aria-label="Copy ID"
                          >
                            {copiedField?.type === 'id' && copiedField?.value === user.id ? (
                              <Check className="h-3.5 w-3.5 text-green-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-mono text-xs text-zinc-600 dark:text-zinc-300">
                      {editingId === user.id ? (
                        <Input
                          value={editData.rifd as string}
                          onChange={(e) => setEditData({ ...editData, rifd: e.target.value })}
                          className="w-full"
                        />
                      ) : (
                        <div className="flex items-center gap-1">
                          <span>{user.rifd}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                            onClick={() => handleCopy(user.rifd, 'rifd')}
                            aria-label="Copy RIFD"
                          >
                            {copiedField?.type === 'rifd' && copiedField?.value === user.rifd ? (
                              <Check className="h-3.5 w-3.5 text-green-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === user.id ? (
                        <Input
                          value={editData.name as string}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-zinc-900 dark:text-white">{user.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                            onClick={() => handleCopy(user.name, 'name')}
                            aria-label="Copy Name"
                          >
                            {copiedField?.type === 'name' && copiedField?.value === user.name ? (
                              <Check className="h-3.5 w-3.5 text-green-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === user.id ? (
                        <Input
                          value={(editData.role as string[])?.join(", ") || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              role: e.target.value.split(",").map((r) => r.trim()).filter(Boolean),
                            })
                          }
                          placeholder="Admin, User, Hacker"
                          className="w-full"
                        />
                      ) : (
                        <span className="text-zinc-600 dark:text-zinc-300">{formatRole(user.role)}</span>
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === user.id ? (
                        <Input
                          value={editData.picture as string}
                          onChange={(e) => setEditData({ ...editData, picture: e.target.value })}
                          placeholder="https://..."
                          className="w-full"
                        />
                      ) : (
                        formatPicture(user.picture)
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === user.id ? (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editData.isHacker as boolean}
                            onChange={(e) => setEditData({ ...editData, isHacker: e.target.checked })}
                            className="w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary"
                          />
                          <span className="text-xs text-zinc-500">Hacker</span>
                        </label>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            user.isHacker
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {user.isHacker ? "Yes" : "No"}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-300 text-xs">
                      {user.people ? (
                        <span>{user.people.name} ({user.people.sexe})</span>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-500">—</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {editingId === user.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleCancelEdit}
                            disabled={savingId === user.id}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSave(user.id)}
                            disabled={savingId === user.id}
                          >
                            {savingId === user.id ? (
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
                            onClick={() => handleEditClick(user)}
                            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Dialog open={deleteConfirmId === user.id} onOpenChange={handleCancelDelete}>
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
                                <DialogTitle>Delete User</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete <strong>{user.name}</strong> (RIFD: {user.rifd})?
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
                                  disabled={deletingId === user.id}
                                >
                                  {deletingId === user.id ? (
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
          Showing {filteredUsers.length} of {users.length} users
        </div>

        {/* Create User Modal */}
        <Dialog open={createModalOpen} onOpenChange={handleCancelCreate}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new user.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">RIFD</label>
                <Input
                  value={createData.rifd as string}
                  onChange={(e) => setCreateData({ ...createData, rifd: e.target.value })}
                  placeholder="e.g., RIFD-001"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
                <Input
                  value={createData.name as string}
                  onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                  placeholder="User's full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Role(s)</label>
                <Input
                  value={(createData.role as string[])?.join(", ") || ""}
                  onChange={(e) =>
                    setCreateData({
                      ...createData,
                      role: e.target.value.split(",").map((r) => r.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Admin, User, Hacker"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Picture URL</label>
                <Input
                  value={createData.picture as string}
                  onChange={(e) => setCreateData({ ...createData, picture: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={createData.isHacker as boolean}
                    onChange={(e) => setCreateData({ ...createData, isHacker: e.target.checked })}
                    className="w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary"
                  />
                  <span>Hacker</span>
                </label>
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
                  "Create User"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}