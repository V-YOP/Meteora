#!/usr/bin/perl
use strict;
use warnings FATAL => 'all';
use v5.16;
use YAML;
use Data::Dumper;
use JSON::PP;
use File::Find;
use lib '.';
use File::Spec::Functions qw/ splitdir /;

sub test_md_text;

sub parse_markdown_snippet {
    $_ = shift;
    /^[\n\s]*((---|\+\+\+)?[\n\s]+|[\n\s]*)(.*)[\n\s]+(---|\+\+\+)[\n\s]+(.*)/s or die 'parse yaml header failed';
    my $yaml_header = $3;
    $_ = $5;
    s/\n\n\n/\n\n/s;
    /```[\n\s]*(\w+)[\n\s]+(.*?)[\n\s]*```[\n\s]+(.*)[\n\s]*$/s or die 'parse snippet and description failed';
    my $lang = $1;
    my $snippet = $2;
    my $desc = $3;
    {
        header  => (Load $yaml_header),
            lang    => $lang,
            snippet => $snippet,
            desc    => $desc,
    }
}

sub read_snippets_dir {
    my ($path) = @_;
    chdir $path;
    my @results = ();
    find sub {
        return if not -T or not /\.md$/;
        my @dirs = splitdir($File::Find::dir);
        shift @dirs if $dirs[0] eq '.';
        # say "categories: [@{[join ', ', @dirs]}], parsing $File::Find::name ...";
        eval {
            open my $md_fh, '<', $_ or die "read file failed";
            local $/ = undef;
            my $snippet = parse_markdown_snippet scalar <$md_fh>;
            $snippet->{categories} = \@dirs;
            push @results, $snippet;
        } or die "parse $File::Find::name failed: $@";
    }, '.';
    \@results;
}

say encode_json read_snippets_dir $ARGV[0];

# 输入Markdown文本，包含YAML头部
sub test_md_text {
    <<'MARKDOWN';
---
title: Sample Title
author: John Doe
date: 2023-09-26
tag:
    - FP
    - MVC
---

```perl
say 'hello!';
say 'hello!';
```

there is desc;
there is desc;
there is desc;
there is desc;
MARKDOWN
}