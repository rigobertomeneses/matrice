import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
import SortableServerCard from './SortableServerCard';
import SkeletonCard from './SkeletonCard';

function ServerList({ servers, onDelete, onEdit, onReorder, loading }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = servers.findIndex((item) => item.id === active.id);
      const newIndex = servers.findIndex((item) => item.id === over.id);

      const reorderedServers = arrayMove(servers, oldIndex, newIndex);
      onReorder(reorderedServers);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(6)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (!servers || servers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-xl text-gray-600 mb-2">No hay servidores registrados</p>
        <p className="text-gray-500">Haz clic en "Agregar Servidor" para comenzar</p>
      </div>
    );
  }

  const serverIds = servers.map(server => server.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={serverIds}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {servers.map((server, index) => (
            <SortableServerCard
              key={server.id}
              id={server.id}
              server={server}
              onDelete={onDelete}
              onEdit={onEdit}
              order={index + 1}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default ServerList;