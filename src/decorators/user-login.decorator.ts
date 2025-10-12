import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserLogin = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
	const request = ctx.switchToHttp().getRequest<{ user: string }>();
	return request.user;
});
