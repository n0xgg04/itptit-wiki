'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { login } from '@/redux/reducers/authSlice'
import { Loader2 } from 'lucide-react'

type FormData = {
  username: string
  password: string
}

interface LoginPopupProps {
  onClose: () => void
}

export function LoginPopup({ onClose }: LoginPopupProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          action: 'login',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Đã có lỗi xảy ra')
      }

      dispatch(login(result.username))
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Đăng nhập</CardTitle>
              <CardDescription>Đăng nhập để gửi tin nhắn</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="username">Tên đăng nhập</Label>
                    <Input 
                      id="username" 
                      {...register('username', { required: 'Vui lòng nhập tên đăng nhập' })}
                      disabled={isLoading}
                    />
                    {errors.username && <span className="text-sm text-red-500">{errors.username.message}</span>}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
                      disabled={isLoading}
                    />
                    {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
                  </div>
                </div>
                {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Hủy</Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    'Đăng nhập'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

