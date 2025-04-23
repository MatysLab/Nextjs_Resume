"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react"
import { cn } from "@/app/lib/utils"

interface DrawerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode
  initiallyOpen?: boolean
  headerClassName?: string
  bodyClassName?: string
}

export function Drawer({
  title,
  initiallyOpen = true,
  className,
  headerClassName,
  bodyClassName,
  children,
  ...props
}: DrawerProps) {
  const [isOpen, setIsOpen] = React.useState(initiallyOpen)

  return (
    <div 
      className={cn(
        "w-full border border-gray-800 rounded-lg overflow-hidden bg-gray-900 shadow-lg mb-4",
        className
      )}
      {...props}
    >
      <div 
        className={cn(
          "flex items-center justify-between px-4 py-3 cursor-pointer bg-gray-800/50 hover:bg-gray-800/70 transition-colors",
          headerClassName
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <button className="p-1 rounded-full hover:bg-gray-700/50 transition-colors">
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: "auto", 
              opacity: 1,
              transition: { 
                height: { 
                  duration: 0.3,
                  ease: "easeInOut" 
                },
                opacity: { 
                  duration: 0.25,
                  delay: 0.05
                } 
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: { 
                height: { 
                  duration: 0.3,
                  ease: "easeInOut" 
                },
                opacity: { 
                  duration: 0.25 
                } 
              } 
            }}
            className="overflow-hidden"
          >
            <div className={cn("p-4", bodyClassName)}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// For a group of drawers where only one can be open at a time
interface DrawerGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function DrawerGroup({
  children,
  className,
  ...props
}: DrawerGroupProps) {
  return (
    <div 
      className={cn("space-y-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// An alternative drawer design with a different style
export function DrawerAlt({
  title,
  initiallyOpen = true,
  className,
  headerClassName,
  bodyClassName,
  children,
  ...props
}: DrawerProps) {
  const [isOpen, setIsOpen] = React.useState(initiallyOpen)

  return (
    <div 
      className={cn(
        "w-full border-0 border-b border-gray-800 overflow-hidden",
        className
      )}
      {...props}
    >
      <div 
        className={cn(
          "flex items-center justify-between px-1 py-3 cursor-pointer hover:bg-gray-900/20 transition-colors",
          headerClassName
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold text-white flex items-center">
          {isOpen ? (
            <ChevronDown className="h-5 w-5 text-blue-400 mr-2" />
          ) : (
            <ChevronRight className="h-5 w-5 text-blue-400 mr-2" />
          )}
          {title}
        </h3>
      </div>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: "auto", 
              opacity: 1,
              transition: { 
                height: { 
                  duration: 0.3,
                  ease: "easeInOut" 
                },
                opacity: { 
                  duration: 0.25,
                  delay: 0.05
                } 
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: { 
                height: { 
                  duration: 0.3,
                  ease: "easeInOut" 
                },
                opacity: { 
                  duration: 0.25 
                } 
              } 
            }}
            className="overflow-hidden"
          >
            <div className={cn("p-2 pl-7", bodyClassName)}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 