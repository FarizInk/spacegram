#!/bin/bash

htpasswd_file="docker/nginx/htpasswd"

generate_htpasswd_entry() {
    local username="$1"
    local password="$2"
    local hashed_password=$(openssl passwd -apr1 "$password")
    echo "$username:$hashed_password"
}

echo "Generating .htpasswd file..."

echo -n "Enter the number of users: "
read num_users

if [[ ! "$num_users" =~ ^[0-9]+$ ]]; then
    echo "Invalid input. Please enter a valid number."
    exit 1
fi

if [ -e "$htpasswd_file" ]; then
    rm "$htpasswd_file"
fi

for ((i=1; i<=num_users; i++)); do
    echo -n "Enter username for user $i: "
    read username

    echo -n "Enter password for user $i: "
    read -s password
    echo

    entry=$(generate_htpasswd_entry "$username" "$password")
    echo "$entry" >> "$htpasswd_file"
done

echo ".htpasswd file generated successfully!"
