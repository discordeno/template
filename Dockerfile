FROM hayd/alpine-deno:1.3.1

WORKDIR /app

USER deno

COPY deps.ts .
RUN deno cache deps.ts

ADD . .
RUN deno cache mod.ts

CMD ["run", "--allow-net", "--allow-read", "--unstable", "./mod.ts"]
