"use client"

import { useSession, signOut } from "next-auth/react"
import { User, Mail, Phone, Calendar, MapPin, Edit, LogOut } from "lucide-react"
import TopBar from "@/components/top-bar"
import BottomNav from "@/components/bottom-nav"
import Card from "@/components/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <p className="p-4 text-center">Memuat...</p>
  }

  if (!session) {
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
    return null
  }

  const user = {
    name: session.user?.name || "Pengguna",
    email: session.user?.email || "-",
    phone: "+62 812-3456-7890", 
    joinDate: "Pengguna Google",
    location: "Indonesia",
    avatar: session.user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <TopBar />
      
      <main className="flex-1 p-4 space-y-4">

        <Card className="bg-card rounded-3xl shadow-md p-6 border border-border/50">
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className="w-24 h-24 mb-4 border-4 border-background shadow-lg">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>
                <User className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>
            
            <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
              <Mail className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
              <Phone className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Telepon</p>
                <p className="font-medium">{user.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
              <Calendar className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Bergabung</p>
                <p className="font-medium">{user.joinDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
              <MapPin className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Lokasi</p>
                <p className="font-medium">{user.location}</p>
              </div>
            </div>
          </div>
        </Card>
        <div className="space-y-3">
          <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profil
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full rounded-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </Button>
        </div>

        {/* Stats */}
        <Card className="bg-card rounded-3xl shadow-md p-6 border border-border/50">
          <h3 className="font-semibold text-foreground mb-4">Statistik</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-xl bg-green-50">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-green-800">Upload</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-blue-800">Laporan</div>
            </div>
          </div>
        </Card>
      </main>
      
      <BottomNav active="profile" />
    </div>
  )
}
