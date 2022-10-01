module Test::Coin {

    struct Coin has key {aount: u64}

    public fun initialize(account: &signer) {
        move_to(account, Coin {amount: 1000});
    }

    public fun withdraw (account: &signer, amount: u64): Coin acquires Coin {
        let balance = &mut borrow_global_mut<Coin>(Signer::address_of(account)).amount;
        *balance = *balance - amount;
        Coin {amount}
    }

    public fun deposit (account: address, coin: Coin) acquires Coin {
        let balance = &mut borrow_global_mut<Coin>(account).amount;
        *balance = *balance + coin.amount;
        Coin {amount: _ } = coin;
    }
}
