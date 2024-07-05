$(document).ready(function() {
    var html = '<div class="col-lg-12"><div class="widget"><div class="widget-body">';

    $.ajax({
        url: 'disk_info.json',
        dataType: 'json',
        success: function(data) {
            // Generate HTML content
            html += '<h4 class="widget-title my-3">System Info</h4>';
            html += '<strong>Machine: </strong>'+data.machine+'<br />';
            html += '<strong>Storage: </strong>'+data.storage+'<br />';
            html += '<strong>Used: </strong>'+data.storage_used+' | <strong>Free: </strong>'+data.storage_free+'<br />';
            html += '<div id="contentStorageInfo"><canvas id="storageChartCanvas"></canvas></div>';
            html += '</div></div></div>'; 
            $('#contentInfo').html(html);

            // Initialize Chart.js
            var ctx = document.getElementById('storageChartCanvas').getContext('2d');
            var storageChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Used', 'Free'],
                    datasets: [{
                        data: [data.pct_storage_used, data.pct_storage_free],
                        backgroundColor: ['#ff6f61', '#6fcf97'],
                        hoverBackgroundColor: ['#ff3b2d', '#48b478']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    return tooltipItem.label + ': ' + tooltipItem.raw + '%';
                                }
                            }
                        }
                    }
                }
            });
        },
        error: function() {
            console.error('Failed to load disk information.');
        }
    });
});

