import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  const [user, setUser] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ddRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : null);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "user") {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ddRef.current) return;
      if (!ddRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function initials(name?: string) {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  function handleLogout() {
    localStorage.removeItem("user");
    setUser(null);
    setOpen(false);
    navigate("/");
  }

  return (
    <header className="w-full border-b bg-card/50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold">Evently</div>
          </Link>

          <nav className="hidden md:flex gap-2">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link to="/events">
              <Button variant="ghost" size="sm">Events</Button>
            </Link>
            <Link to="/create">
              <Button variant="ghost" size="sm">Create</Button>
            </Link>
            <Link to="/match">
              <Button variant="ghost" size="sm">Match</Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={ddRef}>
              <button
                onClick={() => setOpen(o => !o)}
                aria-label="Open profile menu"
                className="flex items-center gap-2"
              >
                <Avatar className="w-10 h-10">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback>{initials(user.name)}</AvatarFallback>
                  )}
                </Avatar>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white shadow-md z-50">
                  <div className="px-3 py-2">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                  <div className="border-t" />
                  <button
                    onClick={() => { setOpen(false); navigate("/profile"); }}
                    className="block w-full text-left px-4 py-2 hover:bg-muted"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-muted"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <Button>Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
