import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, TreePine, ShieldCheck, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/mock/data";
import { toast } from "sonner";
import UttarakhandLogo from "@/assets/uttarakhand-logo.png";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Timber Traceability System" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("officer@forest.gov.in");
  const [password, setPassword] = useState("demo1234");
  const [show, setShow] = useState(false);
  const [role, setRole] = useState<Role>("Super Admin");
  const [remember, setRemember] = useState(true);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Enter a valid email");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    signIn({ name: "Demo Officer", email, role });
    toast.success("Welcome back");
    nav({ to: "/dashboard" });
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary/30 via-background to-secondary/20 p-10 lg:flex">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,oklch(0.7_0.15_145/0.4),transparent_45%),radial-gradient(circle_at_80%_70%,oklch(0.42_0.07_55/0.5),transparent_50%)]" />
        <div className="relative flex items-center gap-3">
          <div className="grid place-items-center"><img src={UttarakhandLogo} className="" style={{ width: "139px", height: "170px" }}/></div>
          <div>
            <div className="font-display text-lg font-semibold">Timber Traceability System</div>
            <div className="text-xs text-muted-foreground">Ministry of Environment, Forest & Climate</div>
          </div>
        </div>
        <div className="relative space-y-6">
          <h1 className="font-display text-5xl font-bold leading-tight">Track. Monitor.<br/>Protect.</h1>
          <p className="max-w-md text-muted-foreground">Chain-of-custody for every tagged tree — from registration in the forest to dispatch at the mill.</p>
          <div className="grid max-w-md gap-3 pt-4">
            {[
              { Icon: MapPinned, t: "GIS-grade forest mapping", d: "Boundaries, clusters, satellite layers" },
              { Icon: ShieldCheck, t: "Tamper-evident audit trail", d: "Every action signed and timestamped" },
              { Icon: TreePine, t: "End-to-end timber lineage", d: "From sapling tag to sawmill delivery" },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="flex items-start gap-3 rounded-xl border bg-card/50 p-3 backdrop-blur">
                <Icon className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">{t}</div>
                  <div className="text-xs text-muted-foreground">{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-xs text-muted-foreground">© {new Date().getFullYear()} Forest Department · Secure Portal</div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <form onSubmit={submit} className="w-full max-w-md space-y-6">
          <div className="items-center gap-3 lg:hidden">
            <div className="grid place-items-left d-block mb-3"><img src={UttarakhandLogo} className="" style={{ width: "90px", height: "109px" }} /></div>
            <div className="font-display font-semibold text-lg">Timber Traceability System</div>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">Sign in to your portal</h2>
            <p className="text-sm text-muted-foreground">Use your departmental credentials.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email or Username</Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Demo role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(["Super Admin","Forest Administrator","Forest Officer","Inspector","Viewer"] as Role[]).map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground">
              <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} /> Remember me
            </label>
            <a className="text-primary hover:underline" href="#">Forgot password?</a>
          </div>
          <Button type="submit" className="w-full" size="lg">Sign in</Button>
          </form>
      </div>
    </div>
  );
}