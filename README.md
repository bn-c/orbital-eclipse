# Orbital Eclipse

### Getting Started
```
pnpm i 
pnpm dev
```

```
export ipfs_staging=/home/ubuntu/.ipfs/staging
export ipfs_data=/home/ubuntu/.ipfs/data
sudo docker run -d -t -i --name ipfs -v $ipfs_staging:/export -v $ipfs_data:/data/ipfs --network host --restart unless-stopped ipfs/kubo:latest
```