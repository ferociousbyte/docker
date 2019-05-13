FROM debian:stretch-slim

# Environment variables
ENV DENO_VERSION=v0.5.0 \
    PATH="/root/.deno/bin:${PATH}"

# Requirements and installation
RUN apt -qq update \
    && apt -qq install -y --no-install-recommends curl ca-certificates \
    && curl -fsSL https://deno.land/x/install/install.sh | sh -s ${DENO_VERSION} \
    && deno version

ENTRYPOINT [ "deno" ]
CMD [ "version" ]