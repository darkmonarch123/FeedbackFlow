(function(window){
    // Defaults to green if no color is provided
    var config = window.FeedbackFlowConfig || { tenantId: 'unknown', color: '#10b981' };

    // 1. Create the floating button
    var btn = document.createElement('button');
    btn.innerHTML = 'Feedback';
    btn.style.cssText = "position:fixed; bottom:30px; right:30px; padding:15px 25px; " +
                        "background:" + config.color + "; color:white; border:none; border-radius:100px; " +
                        "cursor:pointer; font-weight:bold; box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.4); " +
                        "transition: all 0.3s ease; z-index:9999; font-family: sans-serif;";
                        
    btn.onmouseover = function() { this.style.transform = "translateY(-3px)"; };
    btn.onmouseout = function() { this.style.transform = "translateY(0)"; };

    // 2. Create the form container
    var formContainer = document.createElement('div');
    formContainer.style.cssText = "display:none; opacity:0; transform: translateY(20px); " +
                                  "transition: all 0.3s ease; position:fixed; bottom:100px; right:30px; " +
                                  "width:320px; background:white; border-radius:16px; padding:25px; " +
                                  "box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); z-index:9999; " +
                                  "border: 1px solid #f1f5f9; font-family: sans-serif;";
    
    // Matched IDs to the event listener below (ff-email, ff-msg, ff-submit)
    formContainer.innerHTML = `
        <h3 style="margin-top:0; color:#0f172a;">We value your feedback!</h3>
        <input type="email" id="ff-email" placeholder="Your email" style="width:100%; box-sizing:border-box; padding:10px; margin-bottom:15px; border:1px solid #e2e8f0; border-radius:8px; outline:none;" required />
        <textarea id="ff-msg" placeholder="Tell us what you think..." style="width:100%; box-sizing:border-box; padding:10px; margin-bottom:15px; border:1px solid #e2e8f0; border-radius:8px; outline:none; resize:none;" rows="4" required></textarea>
        <button id="ff-submit" style="width:100%; padding:12px; background:${config.color}; color:white; font-weight:bold; border:none; border-radius:8px; cursor:pointer; transition: opacity 0.2s;">Send Feedback</button>
    `;
    
    document.body.appendChild(btn);
    document.body.appendChild(formContainer);

    // 3. Toggle Form Logic
    btn.onclick = function() {
        if (formContainer.style.display === 'none') {
            formContainer.style.display = 'block';
            setTimeout(function() {
                formContainer.style.opacity = '1';
                formContainer.style.transform = 'translateY(0)';
            }, 10);
        } else {
            formContainer.style.opacity = '0';
            formContainer.style.transform = 'translateY(20px)';
            setTimeout(function() { formContainer.style.display = 'none'; }, 300);
        }
    };
    
    // 4. Submit Logic
    document.getElementById('ff-submit').onclick = function() {
        var email = document.getElementById('ff-email').value;
        var msg = document.getElementById('ff-msg').value;
        var btnRef = this;
        
        if(!email || !msg) return alert("Please fill out all fields.");

        btnRef.innerText = "Sending...";
        btnRef.style.opacity = "0.7";
        
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/api/feedback", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                btnRef.innerText = "Sent!";
                setTimeout(function() {
                    formContainer.style.display = 'none';
                    document.getElementById('ff-msg').value = '';
                    document.getElementById('ff-email').value = '';
                    btnRef.innerText = "Send Feedback";
                    btnRef.style.opacity = "1";
                }, 1000);
            }
        };
        
        xhr.send(JSON.stringify({
            tenantId: config.tenantId,
            email: email,
            message: msg
        }));
    };
})(window);