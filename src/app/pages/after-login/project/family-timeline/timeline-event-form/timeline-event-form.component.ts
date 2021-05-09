import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-timeline-event-form',
    templateUrl: './timeline-event-form.component.html',
    styles: [
        `
            .event {
                margin-bottom: 20px;
                border: 1px solid #edf1f7;
                padding: 15px;

                & & {
                    margin-bottom: 0;
                }
            }
        `
    ]
})
export class TimelineEventFormComponent implements OnInit {
    @Input() submitted: boolean;
    @Input() eventsGroup: FormGroup;
    @Input() events: Array<{
        title: string;
        type: string;
        description: string;
        timestamp: Date;
        emotionType: string;
        images: Array<string>;
    }>;
    emotionTypes = [
        {
            name: 'Happy',
            value: 'HAPPY'
        },
        {
            name: 'Angry',
            value: 'ANGRY'
        }
    ];

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        if (this.events) {
            this.fillEvents(this.events);
        }
    }

    get eventDatas(): FormArray {
        return this.eventsGroup.get('eventDatas') as FormArray;
    }

    fillEvents(events: Array<any>): void {
        events = this.events.map((event: any, i: number) => {
            if (i !== 0) {
                this.addEvent();
            }
            return {
                title: event.title,
                type: event.type,
                description: event.description,
                timestamp: event.timestamp,
                emotionType: event.emotionType,
                images: event.images
            };
        });
        this.eventsGroup.patchValue({
            eventDatas: events ? events : []
        });
    }

    addEvent(): void {
        this.eventDatas.push(
            this.fb.group({
                title: ['', [Validators.required]],
                type: ['', [Validators.required]],
                description: ['', [Validators.required]],
                timestamp: ['', [Validators.required]],
                emotionType: ['', [Validators.required]],
                images: this.fb.array([])
            })
        );
    }

    removeEvent(index: number): void {
        if (this.eventDatas && this.eventDatas.length > 1) {
            this.eventDatas.removeAt(index);
        }
    }
}
