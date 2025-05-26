module.exports = {
    apps: [{
        name: 'shopping-list-api',
        script: 'server.js',
        instances: 'max',
        exec_mode: 'cluster',
        env: {
            NODE_ENV: 'production',
            PORT: 3000
        },
        env_production: {
            NODE_ENV: 'production',
            PORT: 3000
        },
        log_file: './logs/combined.log',
        out_file: './logs/out.log',
        error_file: './logs/error.log',
        log_date_format: 'YYYY-MM-DD HH:mm Z',
        merge_logs: true,
        watch: false,
        max_memory_restart: '1G',
        node_args: '--max-old-space-size=1024'
    }]
};