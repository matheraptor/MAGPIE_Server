#!/bin/bash

echo "🔄 [1/6] Stopping existing throttle_node.sh instances..."
if pkill -f throttle_node.sh; then
    echo "   ✅ Successfully stopped active instances."
else
    echo "   ℹ️  No active instances found to stop."
fi

echo "🏠 [2/6] Navigating to MAGPIE_Server directory..."
cd ~/MAGPIE_Server || { echo "   ❌ Error: Directory ~/MAGPIE_Server not found!"; exit 1; }

echo "🗑️ [3/6] Removing local throttle_node.sh copy..."
rm -f throttle_node.sh

echo "📥 [4/6] Pulling latest changes from Git..."
if git pull; then
    echo "   ✅ Git pull completed successfully."
else
    echo "   ❌ Error: Git pull failed!"
    exit 1
fi

echo "🛠️ [5/6] Restoring throttle_node.sh file..."
if git restore throttle_node.sh; then
    echo "   ✅ File restored successfully."
else
    echo "   ❌ Error: Could not restore throttle_node.sh!"
    exit 1
fi

echo "🚀 [6/6] Launching throttle_node.sh in the background..."
chmod +x throttle_node.sh
./throttle_node.sh >/dev/null 2>&1 &
echo "   ✅ Script launched in background with PID: $!"

echo "🏠 Returning to home directory..."
cd ~
echo "🎉 Update and execution sequence finished!"
