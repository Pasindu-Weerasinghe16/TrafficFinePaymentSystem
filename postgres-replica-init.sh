#!/bin/bash
set -e

# Wait for primary to be ready
until pg_isready -h sl-police-postgres-primary -p 5432 -U traffic_fine; do
  echo "Waiting for primary database to be ready..."
  sleep 2
done

# If data directory is empty or missing expected files, run pg_basebackup
if [ -z "$(ls -A /var/lib/postgresql/data)" ] || [ ! -f /var/lib/postgresql/data/PG_VERSION ]; then
    echo "Running pg_basebackup from primary..."
    # Clean directory just in case it has lost+found or similar
    rm -rf /var/lib/postgresql/data/*
    
    export PGPASSWORD=replicator_pass
    pg_basebackup -h sl-police-postgres-primary -D /var/lib/postgresql/data -U replicator -vP -w
    
    # Create standby.signal to indicate this is a replica (for Postgres 12+)
    touch /var/lib/postgresql/data/standby.signal
    
    # Configure postgresql.conf for replica
    echo "primary_conninfo = 'host=sl-police-postgres-primary port=5432 user=replicator password=replicator_pass application_name=sl-police-postgres-replica'" >> /var/lib/postgresql/data/postgresql.conf
fi

echo "Starting PostgreSQL..."
exec docker-entrypoint.sh postgres
