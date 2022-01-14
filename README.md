# Genzee Subgraph

You can use this subgraph to query all kinds of information about genzees and genzee owners. For instance, you can calculate rewards, see the real owner count, and how many genzees are staked.

Try using one of the queries below in the playground.

https://thegraph.com/hosted-service/subgraph/alephao/genzee

### Example Queries

#### Get genzee stats

```graphql
{
  genzeeInfo(id: "v1") {
    totalGenzeeOwners
    totalGenzeesStaked
    totalOddxClaimed
  }
}
```

#### All info of a wallet

This includes all genzees of the wallet and all info for the genzees.

```graphql
{
  user(id: "your_address_lowercased") {
    genzeeBalance
    oddxBalance
    oddxClaimed
    tokens {
      id
      stakedAt
      oddxClaimed
      latestUnstakedClaim
    }
  }
}
```

### Contributing

Everyone is welcome to contribute. Here are some ways you can contribute:

- Report a bug
- Fix a bug
- Enhance docs
- Answer other people's questions on open issues

### Building the project

```console
npm install
npm run codegen
npm run build
```

### Deploying

```console
npm run deploy
```
