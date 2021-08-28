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

where Deno will download the versioned dependencies into its cache, and run the utility with the restricted permissions specified in the `alias` command.

![image](https://user-images.githubusercontent.com/899558/131217147-b0de7608-4e08-4cb0-8484-a924514c2b93.png)

<hr>
<a href='https://twitter.com/EvanSummers16'>https://twitter.com/EvanSummers16</a>
