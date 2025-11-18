import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Sistema de Inventario Escolar</CardTitle>
          <CardDescription>
            Fase 0 - Setup del Proyecto Completado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Sistema web para gestionar 7,000+ ítems físicos de la institución educativa.
          </p>
          <div className="flex gap-4">
            <Button>Backend API: http://localhost:8000</Button>
            <Button variant="outline">Frontend: http://localhost:3000</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
