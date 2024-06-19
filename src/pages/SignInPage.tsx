import React, { useEffect } from 'react'
import { useAuthContext } from '../store/auth'
import { useNavigate } from 'react-router-dom'

const SignInPage = () => {
  const authCtx = useAuthContext()
  const navigate = useNavigate()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(fd.entries())
    authCtx.login(data.email as string, data.password as string)
  }

  useEffect(() => {
    if (authCtx.isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [authCtx.isAuthenticated])

  return (
    <form onSubmit={onSubmit}>
      <fieldset>
        <label htmlFor='email'>이메일</label>
        <input type='email' id='email' name='email' />
      </fieldset>
      <fieldset>
        <label htmlFor='password'>비밀번호</label>
        <input type='password' id='password' name='password' />
      </fieldset>
      <button>로그인 하기</button>
      {authCtx.isAuthenticated !== undefined && !authCtx.isAuthenticated && (
        <p>로그인이 실패했습니다. 다시 시도해주세요.</p>
      )}
    </form>
  )
}

export default SignInPage
