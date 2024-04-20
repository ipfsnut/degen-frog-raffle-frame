import type { Input } from 'hono'
import type { CastActionContext, Context } from '../types/context.js'
import type { Env } from '../types/env.js'

type GetCastActionContextParameters<
  env extends Env = Env,
  path extends string = string,
  input extends Input = {},
> = {
  context: Context<env, path, input>
}

type GetCastActionContextReturnType<
  env extends Env = Env,
  path extends string = string,
  input extends Input = {},
> = {
  context: CastActionContext<env, path, input>
}

export function getCastActionContext<
  env extends Env,
  path extends string,
  input extends Input = {},
>(
  parameters: GetCastActionContextParameters<env, path, input>,
): GetCastActionContextReturnType<env, path, input> {
  const { context } = parameters
  const { env, frameData, req, verified } = context || {}

  if (!frameData)
    throw new Error('Frame data must be present for action handlers.')

  return {
    context: {
      env,
      error: (data) => ({
        error: data,
        format: 'cast-action',
        status: 'error',
      }),
      actionData: {
        buttonIndex: 1,
        castId: frameData.castId,
        fid: frameData.fid,
        network: frameData.network,
        messageHash: frameData.messageHash,
        timestamp: frameData.timestamp,
        url: frameData.url,
      },
      req,
      res: (data) => ({
        data,
        format: 'cast-action',
        status: 'success',
      }),
      var: context.var,
      verified,
    },
  }
}
