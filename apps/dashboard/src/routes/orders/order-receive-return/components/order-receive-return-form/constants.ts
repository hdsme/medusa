import { z } from "zod"

export const ReceiveReturnSchema = z.object({
  items: z.array(
    z.object({
      quantity: z.number().nullable(),
      written_off_quantity: z.number().nullable(),
      item_id: z.string(),
    })
  ),
  send_notification: z.boolean().optional(),
})
