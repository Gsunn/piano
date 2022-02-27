import { Component, ElementRef, ViewChild } from '@angular/core';
import * as Tone from 'tone'
import * as p5 from 'p5'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'piano';

  @ViewChild('piano')
  piano!: ElementRef;


  // synth = new Tone.Synth().toDestination();

  synth = new Tone.MonoSynth({
    oscillator: {
      type: "square"
    },
    envelope: {
      attack: 0.1
    }
  }).toDestination()


  meter = new Tone.Meter()


  filter = new Tone.Filter(400, 'lowpass').toDestination();
  feedbackDelay = new Tone.FeedbackDelay(0.125, 0.5).toDestination();
  distortion = new Tone.Distortion(0.4).toDestination();
  reverb = new Tone.Reverb({
    decay: 5,
    wet: 0.5,
    preDelay: .2
  }).toDestination()

  chorus = new Tone.Chorus(30, 70).toDestination()

  constructor() {
    //this.synth.connect(this.distortion);
    // this.synth.connect(this.feedbackDelay)
    // this.synth.connect(this.filter)
    this.synth.connect(this.feedbackDelay).connect(this.chorus)
      .connect(this.reverb).connect(this.meter)

  }


  ngAfterViewInit() {
    const keys = this.piano.nativeElement.querySelectorAll('.key');
    for (let key of keys) {
      key.addEventListener('click', this.playSound.bind(this))
    }
  
    new p5(p => {
       p.setup = () => {
        p.createCanvas(500, 500)
    
      }


      p.draw = () => {
        console.log('arrow draw');
        //p.background(15);
        const dim = Math.min(p.width, p.height);
         //p.stroke(255);
         p.strokeWeight(dim * 0.0175);
         //p.noFill();
        console.log(this.meter.getValue() );
        const scale = p.map(Number(this.meter.getValue()) * (1), -100, -30, 0, 1, true);
        p.circle(p.width/  2, p.height / 2, dim * 0.4 * scale);
        console.log(scale);

        p.triangle(30, 75, 58, 20, 86, 75)
        p.rect(200, 200, 60, 60)     

              
      }
    })

  }

  // Render loop that draws shapes with p5
  draw(p: any) {
    console.log('draw');
    // Make sure async setup() is done before we draw

    // Black background
    p.background(0, 0, 0, 20);

    p.stroke(255);
    p.strokeWeight(0.0175);
    p.noFill();


    // Draw a 'play' button
    p.noStroke();
    p.fill(255);
    p.polygon(400 / 2, 400 / 2, 40 * 0.1, 3);
  }

  playSound(key: any): void {
    //console.log('play ->', key.target.getAttribute('data-key'));

    const note = key.target.getAttribute('data-key')
    const octave = key.target.getAttribute('data-octave')
    const now = Tone.now()

    //play a middle 'C' for the duration of an 8th note
    // this.synth.triggerAttackRelease(note+tone, "8n");

    // trigger the attack immediately
    this.synth.triggerAttack(note + octave, now)
    // wait one second before triggering the release
    this.synth.triggerRelease(now + 1)

  }

}
