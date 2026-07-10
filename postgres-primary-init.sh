#!/bin/bash
set -e

echo "Creating replication user..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'replicator_pass';
    SELECT pg_create_physical_replication_slot('replica_slot');
EOSQL

echo "host replication replicator all md5" >> "$PGDATA/pg_hba.conf"
