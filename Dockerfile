FROM denoland/deno
COPY . /code
WORKDIR /code
CMD ["deno","run","-A","main.ts"]