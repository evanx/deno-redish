# deno-redish

Deno CLI utility for pretty printing Redis hashes

Recommended usage is to `alias` the `deno run` command with restricted access to Redis only, as follows:

```shell
alias redish='deno -q run --allow-net=127.0.0.1:6379 https://raw.githubusercontent.com/evanx/deno-redish/v0.0.1/main.ts'
```

Then this `redish` alias can be used relatively securely as follows:

```shell
redish test:redish:h
```

where Deno will download the versioned dependencies into its cache, and run the utlity with the restricted permissions specified in the `alias` command.

<hr>
<a href='https://twitter.com/EvanSummers16'>https://twitter.com/EvanSummers16</a>
