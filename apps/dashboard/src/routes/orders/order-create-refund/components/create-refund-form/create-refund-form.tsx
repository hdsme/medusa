import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, CurrencyInput, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { useRefundPayment } from "../../../../../hooks/api"
import { getCurrencySymbol } from "../../../../../lib/data/currencies"
import { formatCurrency } from "../../../../../lib/format-currency"

type CreateRefundFormProps = {
  payment: HttpTypes.AdminPayment
}

const CreateRefundSchema = zod.object({
  amount: zod.number(),
})

export const CreateRefundForm = ({ payment }: CreateRefundFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const paymentAmount = payment.amount as unknown as number

  const form = useForm<zod.infer<typeof CreateRefundSchema>>({
    defaultValues: {
      amount: paymentAmount,
    },
    resolver: zodResolver(CreateRefundSchema),
  })

  const { mutateAsync, isPending } = useRefundPayment(payment.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        amount: data.amount,
      },
      {
        onSuccess: () => {
          toast.success(
            t("orders.payment.refundPaymentSuccess", {
              amount: formatCurrency(data.amount, payment.currency_code),
            })
          )

          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <RouteDrawer.Body>
          <div className="flex flex-col gap-y-4">
            <Form.Field
              control={form.control}
              name="amount"
              rules={{
                required: true,
                min: 0,
                max: paymentAmount,
              }}
              render={({ field: { onChange, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.amount")}</Form.Label>

                    <Form.Control>
                      <CurrencyInput
                        {...field}
                        min={0}
                        onChange={(e) => {
                          const val =
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)

                          onChange(val)

                          if (val && !isNaN(val)) {
                            if (val < 0 || val > paymentAmount) {
                              form.setError(`amount`, {
                                type: "manual",
                                message: t(
                                  "orders.payment.createRefundWrongQuantity",
                                  { number: paymentAmount }
                                ),
                              })
                            } else {
                              form.clearErrors(`amount`)
                            }
                          }
                        }}
                        code={payment.currency_code}
                        symbol={getCurrencySymbol(payment.currency_code)}
                        value={field.value}
                      />
                    </Form.Control>

                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>
        </RouteDrawer.Body>

        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>

            <Button
              isLoading={isPending}
              type="submit"
              variant="primary"
              size="small"
              disabled={!!Object.keys(form.formState.errors || {}).length}
            >
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
