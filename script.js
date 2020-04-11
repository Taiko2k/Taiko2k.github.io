
var c = document.getElementById("screen");
var x = c.getContext("2d");

var t1 = 0;
var t2 = 0;
var ft = 0.0;

var part_pos_x = [1110, 1200, 1300];
var part_pos_y = [1400, 1500, 1600];
var part_vel_x = [0, 0, 0];
var part_vel_y = [0, 0, 0];
var parts = 3

var eff_time = 100;
var eff_x = -1000;
var eff_y = -1000;

var step = 0;

var mx = 0;
var my = 0;

function update_mouse(e){
  var x = e.clientX;
  var y = e.clientY;
  if (! isNaN(x) && ! isNaN(y)){
    mx = x;
    my = y;
  }
}

document.addEventListener('mousemove', update_mouse);

function render(){

  x.clearRect(0, 0, c.width, c.height);

  var w_w = window.innerWidth;
  var w_h = window.innerHeight;
  x.canvas.width  = w_w;
  x.canvas.height = w_h;

  t2 = performance.now();
  ft = (t2 - t1) / 1000;
  t1 = t2;

  step = 12 * ft;

  // Special
  var dif = t2 - eff_time;
  if (0.0 < dif){
  x.strokeStyle = "#FFFFFF";
  x.globalAlpha = Math.max(0.0, 0.35 - dif / 4000);
  x.beginPath();
  x.arc(eff_x, eff_y, dif / 7, 0, 2 * Math.PI);
  x.stroke();
  }

  // Particles
  var i;
  for (i = 0; i < parts; i++) {
    var xx = part_pos_x[i];
    var yy = part_pos_y[i];
    var vx = part_vel_x[i];
    var vy = part_vel_y[i];

    var mag = Math.sqrt(Math.pow(my - yy, 2) + Math.pow(mx - xx, 2));
    var direc = Math.atan((my - yy) / (mx - xx));

    if (! isNaN(mag) && ! isNaN(direc)){

      var q;
      for (q = 0; q < parts; q++) {
        if (q == i){continue;}
        var mag2 = Math.sqrt(Math.pow(part_pos_y[q] - yy, 2) + Math.pow(part_pos_x[q] - xx, 2));
        if (mag2 < 7 && Math.abs(t2 - eff_time) > 5 && xx > 20 && yy > 20 && yy < w_h - 20 && xx < w_w - 20){
          console.log("Hit")
          eff_x = xx;
          eff_y = yy;
          eff_time = performance.now();
        }
      }

      var comp_x = Math.cos(direc);
      var comp_y = Math.sin(direc);

      if (mx < xx){
        comp_x *= -1;
        comp_y *= -1;
      }

      vx = vx + (comp_x * step);
      vy = vy + (comp_y * step);

      if (yy < -200){
        vx = vx / 2;
        vy = 0.0;
        yy = -199;
      }

      if (xx < -200){
        vx = 0.0;
        vy = vy / 2;
        xx = -199;
      }

      if (yy > w_h + 200){
        vx = vx / 2;
        vy = 0.0;
        yy = w_h + 199;
      }

      if (xx > w_w + 200){
        vx = 0.0;
        vy = vy / 2;
        xx = w_w + 199;
      }

      yy = yy + (step * vy);
      xx = xx + (step * vx);

      }

    part_pos_x[i] = xx;
    part_pos_y[i] = yy;
    part_vel_x[i] = vx;
    part_vel_y[i] = vy;

    x.globalAlpha = 0.3;
    x.fillStyle = "#FFFFFF";
    x.beginPath();
    x.arc(xx, yy, 3, 0, 2 * Math.PI);
    x.fill();

  }

  window.requestAnimationFrame(render);
}
window.requestAnimationFrame(render);
