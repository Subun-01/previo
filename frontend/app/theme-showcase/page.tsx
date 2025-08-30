"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function ThemeShowcase() {
  return (
    <div className="min-h-screen p-8">
      <div className="container-max space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gradient">
            Futuristic UI Theme Showcase
          </h1>
          <p className="opacity-70 text-lg">
            Experience the power of gradient-driven, glassmorphic design
          </p>
        </div>

        {/* Button Variants */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>Different button styles with futuristic effects</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="default">Default</Button>
            <Button variant="gradient">Gradient</Button>
            <Button variant="glass">Glass</Button>
            <Button variant="neon">Neon</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
          </CardContent>
        </Card>

        {/* Card Variants */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>Standard card style</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is a default card with standard styling.</p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>Glass Card</CardTitle>
              <CardDescription>Glassmorphism effect</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card features a beautiful glassmorphic design with backdrop blur.</p>
            </CardContent>
          </Card>

          <Card variant="glow">
            <CardHeader>
              <CardTitle>Glow Card</CardTitle>
              <CardDescription>Subtle neon glow</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card has a subtle purple glow effect on hover.</p>
            </CardContent>
          </Card>
        </div>

        {/* Form Elements */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
            <CardDescription>Futuristic input styling with glow effects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Type your message here..." />
            </div>
          </CardContent>
        </Card>

        {/* Badges and Components */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Badges & Components</CardTitle>
            <CardDescription>Various UI components with futuristic styling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Color Demonstration */}
        <Card variant="gradient">
          <CardHeader>
            <CardTitle className="text-white">Gradient Card</CardTitle>
            <CardDescription className="text-white/80">
              Purple to pink to blue gradient background
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-white space-y-4">
              <p>This card demonstrates the primary gradient colors in action.</p>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                  Outline
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
