
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

interface CollapsibleAdminItemProps {
  title: string;
  subtitle?: string | React.ReactNode;
  badges?: React.ReactNode;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
}

const CollapsibleAdminItem = ({
  title,
  subtitle,
  badges,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  children
}: CollapsibleAdminItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Clear selection when item is collapsed
  useEffect(() => {
    if (!isOpen && isSelected && onSelect) {
      onSelect(); // This will toggle selection off when item is collapsed
    }
  }, [isOpen, isSelected, onSelect]);

  return (
    <Card className={`overflow-hidden ${isSelected ? 'border-portfolio-orange' : ''}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div 
          className="flex justify-between p-4 cursor-pointer"
          onClick={() => {
            if (onSelect) onSelect();
            setIsOpen(!isOpen); // Toggle isOpen state on click
          }}
        >
          <div className="flex-1">
            <div className="flex items-center">
              {isOpen ? (
                <ChevronDown className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
              )}
              <h3 className="font-medium">{title}</h3>
            </div>
            {subtitle && (
              <div className="text-sm text-muted-foreground ml-6">
                {subtitle}
              </div>
            )}
            {badges && (
              <div className="flex flex-wrap gap-1 mt-1 ml-6">
                {badges}
              </div>
            )}
          </div>
        </div>

        <CollapsibleContent>
          <div className="border-t pt-4 p-4">
            {children}
            
            {(onEdit || onDelete) && (
              <div className="flex justify-end gap-2 mt-4">
                {onDelete && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                  >
                    Delete
                  </Button>
                )}
                {onEdit && (
                  <Button 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                    className="bg-portfolio-blue"
                  >
                    Edit
                  </Button>
                )}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default CollapsibleAdminItem;
