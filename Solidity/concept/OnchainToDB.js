const { ethers } = require('ethers')
const MongoClient = require('mongodb').MongoClient

// Connect to Ethereum network using Infura
const provider = new ethers.providers.InfuraProvider(
  'mainnet',
  'your-infura-project-id'
)

// Connect to MongoDB database
const mongoUrl = 'mongodb://localhost:46587'
const dbName = 'ethereum'
const client = new MongoClient(mongoUrl, { useUnifiedTopology: true })
client.connect(err => {
  if (err) throw err
  console.log('Connected to MongoDB')

  // Select the ethereum database
  const db = client.db(dbName)

  // Get the latest 10 blocks of transaction data
  provider.getBlockNumber().then(latestBlockNumber => {
    for (let i = 0; i < 10; i++) {
      const blockNumber = latestBlockNumber - i
      provider.getBlock(blockNumber).then(block => {
        // Insert the block's transaction data into the transactions collection
        const transactions = block.transactions.map(tx => {
          return {
            blockNumber: blockNumber,
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: ethers.utils.formatEther(tx.value),
            gasUsed: tx.gasLimit.toString()
          }
        })
        db.collection('transactions').insertMany(
          transactions,
          (err, result) => {
            if (err) throw err
            console.log(
              `Inserted ${result.insertedCount} transactions into MongoDB`
            )
          }
        )
      })
    }
  })
})
