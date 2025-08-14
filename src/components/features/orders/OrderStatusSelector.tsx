// File: src/components/features/order/OrderStatusSelector.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus } from "@/app/admin/orders/actions";
import { useTransition } from "react";

interface OrderStatusSelectorProps {
  orderId: number;
  currentStatus: string;
}

export function OrderStatusSelector({ orderId, currentStatus }: OrderStatusSelectorProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: string) => {
    startTransition(() => {
      updateOrderStatus(orderId, newStatus);
    });
  };

  return (
    <Select
      defaultValue={currentStatus}
      onValueChange={handleStatusChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Ubah status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">pending</SelectItem>
        <SelectItem value="processing">processing</SelectItem>
        <SelectItem value="shipped">shipped</SelectItem>
        <SelectItem value="delivered">delivered</SelectItem>
        <SelectItem value="cancelled">cancelled</SelectItem>
        <SelectItem value="success">success</SelectItem>
      </SelectContent>
    </Select>
  );
}