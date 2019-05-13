FROM debian:stretch-slim

# Environment variables
ENV PATH="/root/.deno/bin:${PATH}"

# Requirements and installation
RUN apt -qq update \
    && apt -qq install -y --no-install-recommends curl ca-certificates \
    && curl -fsSL https://deno.land/x/install/install.sh | sh -s ${DENO_VERSION} \
    && deno version

ENTRYPOINT [ "deno" ]
CMD [ "version" ]