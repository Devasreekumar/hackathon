import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { toast } from 'sonner';
import api from '../utils/api';

export default function ExhibitionsPage({ onBack }) {
  const location = useLocation();
  const [exhibitions, setExhibitions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    api.fetchExhibitions().then((data) => {
      if (!mounted) return;
      // normalize id fields to prefer _id from backend
      const normalized = (data || []).map((d) => ({ ...(d || {}), id: d.id || d._id }));
      const sorted = normalized.slice().sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      setExhibitions(sorted);
      // if navigation requested opening a specific exhibition, open it after load
      const requestedId = location?.state?.openExhibitionId || (location?.hash ? location.hash.replace('#', '') : null);
      if (requestedId) {
        const found = sorted.find((s) => String(s.id) === String(requestedId));
        if (found) {
          setSelected(found);
          setDialogOpen(true);
        }
      }
    }).catch((err) => {
      console.warn('Error fetching exhibitions', err);
    });
    return () => { mounted = false; };
  }, []);

  const registerInterest = async (ex) => {
    try {
      const res = await api.registerInterestApi(ex.id);
      // update local state visitors count
      setExhibitions((prev) => prev.map((p) => p.id === ex.id ? { ...p, visitors: res.visitors ?? (p.visitors || 0) + 1 } : p));
      toast.success('Registered interest successfully');
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Failed to register interest');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Exhibitions</h1>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onBack}>Back</Button>
          </div>
        </div>

        {exhibitions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">No exhibitions found.</CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {exhibitions.map((ex) => (
              <Card key={ex.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{ex.name}</CardTitle>
                  <CardDescription className="mt-2">{ex.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="size-4" />
                    <span>{ex.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarIcon className="size-4" />
                    <span>
                      {new Date(ex.startDate).toLocaleDateString()} - {new Date(ex.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="size-4" />
                    <span>10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Visitors: {ex.visitors || 0}</div>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2 w-full">
                    <Button onClick={() => registerInterest(ex.id)}>Register Interest</Button>
                    <Button variant="outline" onClick={() => { setSelected(ex); setDialogOpen(true); }}>
                      View Details
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
        <DialogContent>
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
              </DialogHeader>
              <DialogDescription className="mt-2">{selected.description}</DialogDescription>

              <div className="mt-4 space-y-2">
                <div><strong>Location:</strong> {selected.location}</div>
                <div><strong>Dates:</strong> {new Date(selected.startDate).toLocaleDateString()} - {new Date(selected.endDate).toLocaleDateString()}</div>
                <div><strong>Visitors:</strong> {selected.visitors || 0}</div>
                <div><strong>Products showcased:</strong> {selected.products?.length || 0}</div>
              </div>

              <DialogFooter>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          ) : (
            <div>Loading...</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

