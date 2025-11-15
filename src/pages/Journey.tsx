import { Calendar, Heart, MapPin, Edit2, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { journeyStorage } from "@/lib/localStorage";
import { journeyApi, Journey } from "@/lib/api";
import DistanceMap from "@/components/DistanceMap";

const Journey = () => {
  const [journey, setJourney] = useState<Journey>({
    departureDate: "2024-01-15",
    distance: 4842,
    heartMessage: "Missing you every day ❤️",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Journey>(journey);
  const [daysApart, setDaysApart] = useState(0);

  useEffect(() => {
    loadJourney();
  }, []);

  useEffect(() => {
    const today = new Date();
    const departure = new Date(journey.departureDate);
    const days = Math.floor(
      (today.getTime() - departure.getTime()) / (1000 * 60 * 60 * 24)
    );
    setDaysApart(days);
  }, [journey.departureDate]);

  const loadJourney = async () => {
    // Try API first, fallback to localStorage
    const apiResult = await journeyApi.get();
    if (apiResult.success && apiResult.data) {
      setJourney(apiResult.data);
      setEditData(apiResult.data);
    } else {
      const localData = journeyStorage.get();
      setJourney(localData);
      setEditData(localData);
    }
  };

  const saveJourney = async () => {
    // Try API first, fallback to localStorage
    const apiResult = await journeyApi.update(editData);
    if (apiResult.success && apiResult.data) {
      setJourney(apiResult.data);
      journeyStorage.update(apiResult.data);
      toast.success("Journey updated!");
    } else {
      const updated = journeyStorage.update(editData);
      setJourney(updated);
      toast.success("Journey updated!");
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditData(journey);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 pt-6 pb-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Space Journey
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Track your space's journey and milestones
              </p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md hover:scale-110 transition-all"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={saveJourney}
                  className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={cancelEdit}
                  className="p-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Days Apart Card */}
          <div className="glass-card rounded-2xl p-6 card-elevated gradient-warm transition-all duration-300 hover:scale-[1.01]">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-primary-foreground" />
              <h3 className="text-lg font-semibold text-primary-foreground">
                Days Since Apart
              </h3>
            </div>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-primary-foreground/80 mb-2 block font-medium">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={editData.departureDate}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        departureDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-primary-foreground/20 border border-primary-foreground/30 rounded-lg text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
                  />
                </div>
              </div>
            ) : (
              <>
                <p className="text-5xl font-bold text-primary-foreground drop-shadow-sm mb-2">
                  {daysApart}
                </p>
                <p className="text-sm text-primary-foreground/80 font-medium">
                  days and counting
                </p>
                <p className="text-xs text-primary-foreground/60 mt-2">
                  Since{" "}
                  {new Date(journey.departureDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </>
            )}
          </div>

          {/* Distance Card */}
          <div className="glass-card rounded-2xl p-6 card-elevated gradient-calm transition-all duration-300 hover:scale-[1.01]">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-secondary-foreground" />
              <h3 className="text-lg font-semibold text-secondary-foreground">
                Distance From Home
              </h3>
            </div>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-secondary-foreground/80 mb-2 block font-medium">
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    value={editData.distance}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        distance: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 bg-secondary-foreground/20 border border-secondary-foreground/30 rounded-lg text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-secondary-foreground/50"
                  />
                </div>
              </div>
            ) : (
              <>
                <p className="text-4xl font-bold text-secondary-foreground drop-shadow-sm mb-2">
                  {journey.distance.toLocaleString()} km
                </p>
                <p className="text-sm text-secondary-foreground/80 font-medium">
                  but always in our hearts
                </p>
              </>
            )}
          </div>
        </div>

        {/* Heart Message Card */}
        <div className="glass-card rounded-2xl p-6 card-elevated transition-all duration-300 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">
              Heart Message
            </h3>
          </div>
          {isEditing ? (
            <textarea
              value={editData.heartMessage}
              onChange={(e) =>
                setEditData({ ...editData, heartMessage: e.target.value })
              }
              className="w-full px-4 py-3 bg-background/30 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all min-h-[100px]"
              placeholder="Write something heartfelt..."
            />
          ) : (
            <p className="text-lg text-foreground leading-relaxed">
              {journey.heartMessage}
            </p>
          )}
        </div>

        {/* Distance Map */}
        <DistanceMap />
      </div>
    </div>
  );
};

export default Journey;
