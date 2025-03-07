'use client'

import { Card } from "@/components/ui/card";
import { Sparkles, Trophy } from "lucide-react";
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function SubscriptionSection() {
  return (
    <div className="space-y-16 relative">
      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className={cn(
          "p-8 text-center rounded-3xl border backdrop-blur-xl relative overflow-hidden shadow-2xl",
          "border-purple-200/50 bg-gradient-to-br from-purple-50/80 to-violet-50/80"
        )}>
          <div className="relative space-y-6">
            {/* Icon */}
            <div className="flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
                className={cn(
                  "h-16 w-16 rounded-2xl flex items-center justify-center transform transition-transform duration-300",
                  "bg-gradient-to-br from-purple-500 to-violet-500 hover:rotate-12"
                )}
              >
                <Trophy className="h-8 w-8 text-white" />
              </motion.div>
            </div>

            {/* Title and Description */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-purple-600">
                All Features Available
              </h2>
              <p className="text-lg text-muted-foreground">
                Enjoy full access to all application features
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Trophy, text: "Advanced Features" },
                { icon: Sparkles, text: "Dedicated Support" },
                { icon: Sparkles, text: "Custom Templates" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 bg-white/40 border-purple-100 hover:border-purple-200"
                >
                  <item.icon className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm font-medium text-purple-900">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
